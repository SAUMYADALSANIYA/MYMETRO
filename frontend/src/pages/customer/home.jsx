import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

import { getAllMetros, getAllStations, searchMetro } from "./api";
import SearchBar from "./components/SearchBar";
import MetroCard from "./components/MetroCard";

export default function CustomerHome() {
  const navigate = useNavigate();
  const [metros, setMetros] = useState([]);
  const [stations, setStations] = useState([]);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [results, setResults] = useState([]);
  const [mode, setMode] = useState("all");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      setMsg("");

      const [m, s] = await Promise.all([getAllMetros(), getAllStations()]);
      setMetros(m.metros || []);
      setStations(s.stations || []);
    } catch (e) {
      console.error(e);
      setMsg(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function onSearch(e) {
    e.preventDefault();
    setMsg("");
    setResults([]);
    setMode("search");

    const s = source.trim();
    const d = destination.trim();

    if (!s || !d) {
      setMsg("Please choose source and destination");
      return;
    }

    if (s === d) {
      setMsg("Source and destination cannot be same");
      return;
    }

    try {
      setLoading(true);
      const data = await searchMetro(s, d);
      setResults(data.results || []);

      if ((data.results || []).length === 0) {
        setMsg("No metro found for this route");
      }
    } catch (e) {
      console.error(e);
      setMsg(e.message || "Search failed");
    } finally {
      setLoading(false);
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
    return mode === "all" ? metros : results;
  }, [mode, metros, results]);

  return (
    <div className="customer-dashboard-page">
      <div className="customer-dashboard-header">
        <h1>Customer Dashboard</h1>
        <p>Search metro routes, timings, frequency and fare</p>
      </div>

      <div className="customer-search-section">
        <SearchBar
          stations={stations}
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          onSearch={onSearch}
          onShowAll={onShowAll}
        />
      </div>

      {loading && <div className="customer-message">Loading...</div>}
      {msg && <div className="customer-message">{msg}</div>}

      <div className="customer-cards-grid">
        {list.map((m, index) => (
          <MetroCard
            key={m.routeId || index}
            metro={m}
            isResult={mode === "search"}
            onBook={onBook}
          />
        ))}
      </div>
    </div>
  );
}