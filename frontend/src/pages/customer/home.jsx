import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

import { getAllMetros, searchMetro } from "./api";
import CustomerSearchBar from "./components/CustomerSearchBar";
import CustomerMetroCard from "./components/CustomerMetroCard";
import CustomerMetroMap from "./components/CustomerMetroMap";

function mapMetroResponse(metros) {
  return metros.map((m) => ({
    ...m,
    routeName:         m.routeName,
    color:             m.color || "#1E88E5",
    fareRange:         m.fareRange || "",
    estimatedDuration: m.estimatedDuration || "",
    timing:            m.schedule
      ? `${m.schedule.startTime} - ${m.schedule.endTime}`
      : "N/A",
    frequency: m.schedule
      ? `Every ${m.schedule.frequencyMins} mins`
      : "N/A",
    stations: m.stations
  }));
}

export default function CustomerHome() {
  const navigate = useNavigate();
  const [metroData, setMetroData]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [source, setSource]           = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults]         = useState([]);
  const [mode, setMode]               = useState("all");
  const [msg, setMsg]                 = useState("");

  useEffect(() => {
    getAllMetros()
      .then((data) => {
        setMetroData(mapMetroResponse(data.metros || []));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setFetchError("Could not load metro data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const allStations = useMemo(() => {
    return [...new Set(metroData.flatMap((route) => route.stations.map((s) => s.name)))].sort();
  }, [metroData]);

  // Find map coordinates for a station
  function getStationCoords(stationName) {
    for (const route of metroData) {
      const st = route.stations.find((s) => s.name === stationName);
      if (st) return { lat: st.lat, lng: st.lng };
    }
    return { lat: 0, lng: 0 };
  }

  // Detect exactly which station is the interchange
  function findInterchange(detailedPath) {
    if (!detailedPath || detailedPath.length < 2) return null;
    for (let i = 1; i < detailedPath.length; i++) {
      if (detailedPath[i].line !== detailedPath[i - 1].line) {
        return detailedPath[i - 1].station; // The station before the line swapped
      }
    }
    return null;
  }

  async function onSearch(e) {
    e.preventDefault();
    setMsg("");

    const s = source.trim();
    const d = destination.trim();

    if (!s || !d) {
      setMsg("Please choose source and destination");
      setResults([]);
      setMode("search");
      return;
    }

    if (s === d) {
      setMsg("Source and destination cannot be same");
      setResults([]);
      setMode("search");
      return;
    }

    try {
      const searchResponse = await searchMetro(s, d);
      
      if (searchResponse && searchResponse.data) {
        const routeData = searchResponse.data;
        
        // Construct our route with interchange info included
        const virtualRoute = {
          routeName: routeData.interchangesRequired ? "Interchange Route" : routeData.linesUsed[0],
          color: routeData.interchangesRequired ? "#9C27B0" : (routeData.detailedPath[0]?.color || "#1E88E5"), 
          fareRange: `₹${routeData.fare}`,
          estimatedDuration: `${routeData.estimatedTimeMins} mins`,
          timing: "Current Operations",
          frequency: "N/A",
          stations: routeData.path.map(stationName => ({
            name: stationName,
            ...getStationCoords(stationName)
          })),
          interchangeStation: routeData.interchangesRequired ? findInterchange(routeData.detailedPath) : null
        };

        if (routeData.interchangesRequired) {
          setMsg(`Interchange required! Lines used: ${routeData.linesUsed.join(" -> ")}`);
        } else {
          setMsg("Direct route found.");
        }

        setResults([virtualRoute]);
        setMode("search");
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setMode("search");
      setMsg(err.message || "Route not found between these stations.");
    }
  }

  function onShowAll() {
    setMode("all");
    setResults([]);
    setMsg("");
    setSource("");
    setDestination("");
  }

  function onBook(metro) {
    navigate("/customer/payment", { state: metro });
  }

  const list = useMemo(() => {
    return mode === "all" ? metroData : results;
  }, [mode, metroData, results]);

  if (loading) {
    return (
      <div className="customer-dashboard-page">
        <p style={{ padding: "2rem" }}>Loading metro data…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="customer-dashboard-page">
        <p style={{ padding: "2rem", color: "red" }}>{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="customer-dashboard-page">
      <div className="customer-dashboard-header">
        <h1>Ahmedabad Metro Dashboard</h1>
        <p>Search metro routes, timings, frequency and fare on the map</p>
      </div>

      <div className="customer-search-section">
        <CustomerSearchBar
          stations={allStations}
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          onSearch={onSearch}
          onShowAll={onShowAll}
        />
      </div>

      {msg && <div className="customer-message" style={{
        backgroundColor: msg.includes("Interchange") ? "#E1BEE7" : "#E8F5E9",
        color: msg.includes("Interchange") ? "#4A148C" : "#1B5E20",
        fontWeight: "bold",
        padding: "10px",
        borderRadius: "4px",
        margin: "10px 0"
      }}>{msg}</div>}

      <CustomerMetroMap
        routes={metroData}
        highlightedRoutes={list}
        source={source}
        destination={destination}
      />

      <div className="customer-cards-grid">
        {list.map((metro) => (
          <CustomerMetroCard
            key={metro.routeName}
            metro={metro}
            source={source}
            destination={destination}
            onBook={onBook} 
          />
        ))}
      </div>
    </div>
  );
}