import { useEffect, useMemo, useState } from "react";
import "./home.css";

import { getAllMetros } from "./api";
import CustomerSearchBar from "./components/CustomerSearchBar";
import CustomerMetroCard from "./components/CustomerMetroCard";
import CustomerMetroMap from "./components/CustomerMetroMap";

function mapMetroResponse(metros) {
  return metros.map((m) => ({
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

  function findMatchingRoutes(sourceStation, destinationStation) {
    return metroData.filter((route) => {
      const stationNames = route.stations.map((station) => station.name);
      return (
        stationNames.includes(sourceStation) &&
        stationNames.includes(destinationStation)
      );
    });
  }

  function onSearch(e) {
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

    const matchedRoutes = findMatchingRoutes(s, d);

    if (matchedRoutes.length > 0) {
      setResults(matchedRoutes);
      setMode("search");
      return;
    }

    setResults([]);
    setMode("search");
    setMsg(
      "Direct same-line route not found. Interchange route support can be added next."
    );
  }

  function onShowAll() {
    setMode("all");
    setResults([]);
    setMsg("");
    setSource("");
    setDestination("");
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

      {msg && <div className="customer-message">{msg}</div>}

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
          />
        ))}
      </div>
    </div>
  );
}