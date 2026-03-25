import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

import { getAllMetros, searchMetro } from "./api";
import CustomerSearchBar from "./components/CustomerSearchBar";
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

  function getStationCoords(stationName) {
    for (const route of metroData) {
      const st = route.stations.find((s) => s.name === stationName);
      if (st) return { lat: st.lat, lng: st.lng };
    }
    return { lat: 0, lng: 0 };
  }

  function findInterchange(detailedPath) {
    if (!detailedPath || detailedPath.length < 2) return null;
    for (let i = 1; i < detailedPath.length; i++) {
      if (detailedPath[i].line !== detailedPath[i - 1].line) {
        return detailedPath[i - 1].station;
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
      setMsg("Please choose source and destination.");
      setResults([]);
      setMode("search");
      return;
    }

    if (s === d) {
      setMsg("Source and destination cannot be the same.");
      setResults([]);
      setMode("search");
      return;
    }

    try {
      const searchResponse = await searchMetro(s, d);
      
      if (searchResponse && searchResponse.data) {
        const routeData = searchResponse.data;
        
        // ADDED THE MISSING DATA TO virtualRoute SO IT PASSES TO THE PAYMENT PAGE
        const virtualRoute = {
          routeId: routeData.routeId || routeData.linesUsed[0] || "Custom",
          routeName: routeData.interchangesRequired ? "Interchange Route" : routeData.linesUsed[0],
          color: routeData.interchangesRequired ? "#8E24AA" : (routeData.detailedPath[0]?.color || "#1E88E5"), 
          fare: routeData.fare,             // Added exact fare
          fareRange: `₹${routeData.fare}`,
          source: s,                        // Added source
          destination: d,                   // Added destination
          stops: routeData.path && routeData.path.length > 0 ? routeData.path.length - 1 : 0, // Added stops count
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
          setMsg(`🔄 Interchange required at ${virtualRoute.interchangeStation}`);
        } else {
          setMsg("✅ Direct route found.");
        }

        setResults([virtualRoute]);
        setMode("search");
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setMode("search");
      setMsg("❌ " + (err.message || "Route not found between these stations."));
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

  const isSearchMode = mode === "search" && results.length === 1;
  const activeRoute = isSearchMode ? results[0] : null;

  if (loading) return <div className="customer-dashboard-page"><p style={{ padding: "2rem" }}>Loading metro map…</p></div>;
  if (fetchError) return <div className="customer-dashboard-page"><p style={{ padding: "2rem", color: "red" }}>{fetchError}</p></div>;

  return (
    <div className="customer-dashboard-page">
      
      <div className="customer-dashboard-header">
        <h1>Ahmedabad Metro Journey</h1>
      </div>

      {/* 1. MESSAGE / STATUS BAR ON TOP */}
      {msg && (
        <div className="customer-message-bar" style={{
          backgroundColor: msg.includes("Interchange") ? "#F3E5F5" : msg.includes("✅") ? "#E8F5E9" : "#fee2e2",
          color: msg.includes("Interchange") ? "#6A1B9A" : msg.includes("✅") ? "#2E7D32" : "#991b1b",
          borderColor: msg.includes("Interchange") ? "#d8b4fe" : msg.includes("✅") ? "#bbf7d0" : "#fecaca"
        }}>
          {msg}
        </div>
      )}

      {/* 2. SEARCH BAR */}
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

      {/* 3. FULL WIDTH MAP WITH FLOATING OVERLAY */}
      <div className="customer-map-wrapper">
        <CustomerMetroMap
          routes={metroData}
          highlightedRoutes={list}
          source={source}
          destination={destination}
        />

        {/* FLOATING OVERLAY CARD INSIDE THE MAP */}
        {isSearchMode && activeRoute && (
          <div className="map-overlay-card">
            <h3>{activeRoute.routeName}</h3>
            
            <div className="overlay-row">
              <span>Duration:</span>
              <strong>{activeRoute.estimatedDuration}</strong>
            </div>
            
            <div className="overlay-row">
              <span>Fare:</span>
              <strong style={{ fontSize: '1.2rem', color: '#16a34a' }}>{activeRoute.fareRange}</strong>
            </div>
            
            <div className="overlay-row">
              <span>Stops:</span>
              <strong>{activeRoute.stations.length > 0 ? `${activeRoute.stations.length - 1} stations` : "N/A"}</strong>
            </div>

            <div className="overlay-divider"></div>

            <button className="bookBtn" onClick={() => onBook(activeRoute)}>
              Book Ticket
            </button>
          </div>
        )}
      </div>

    </div>
  );
}