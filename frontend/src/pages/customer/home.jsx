import { useMemo, useState } from "react";
import "./home.css";

import {
  ahmedabadMetroData,
  allAhmedabadStations
} from "./ahmedabadMetroData";
import CustomerSearchBar from "./components/CustomerSearchBar";
import CustomerMetroCard from "./components/CustomerMetroCard";
import CustomerMetroMap from "./components/CustomerMetroMap";

export default function CustomerHome() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState("all");
  const [msg, setMsg] = useState("");

  function findMatchingRoutes(sourceStation, destinationStation) {
    return ahmedabadMetroData.filter((route) => {
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
    return mode === "all" ? ahmedabadMetroData : results;
  }, [mode, results]);

  return (
    <div className="customer-dashboard-page">
      <div className="customer-dashboard-header">
        <h1>Ahmedabad Metro Dashboard</h1>
        <p>Search metro routes, timings, frequency and fare on the map</p>
      </div>

      <div className="customer-search-section">
        <CustomerSearchBar
          stations={allAhmedabadStations}
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
        routes={ahmedabadMetroData}
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