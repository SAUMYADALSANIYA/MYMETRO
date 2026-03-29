import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetroMap from "../components/MetroMap";
import SelectionPanel from "../components/SelectionPanel";
import "./LandingMap.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

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

const LandingMap = () => {
  const navigate = useNavigate();

  const [metroData, setMetroData] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const [selectedRouteName, setSelectedRouteName]       = useState("");
  const [selectedSource, setSelectedSource]             = useState("");
  const [selectedDestination, setSelectedDestination]   = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/public/metros`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load metro data");
        return res.json();
      })
      .then((data) => {
        setMetroData(mapMetroResponse(data.metros || []));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load metro data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const selectedRoute = useMemo(() => {
    return metroData.find((route) => route.routeName === selectedRouteName);
  }, [metroData, selectedRouteName]);

  const canContinue =
    selectedRouteName &&
    selectedSource &&
    selectedDestination &&
    selectedSource !== selectedDestination;

  const handleContinue = () => {
    if (!canContinue) return;

    const tripSelection = {
      routeName:    selectedRouteName,
      source:       selectedSource,
      destination:  selectedDestination,
      selectedAt:   new Date().toISOString()
    };

    localStorage.setItem("metroTripSelection", JSON.stringify(tripSelection));
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="landing-map-page">
        <p style={{ padding: "2rem" }}>Loading metro data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="landing-map-page">
        <p style={{ padding: "2rem", color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="landing-map-page">
      <SelectionPanel
        routes={metroData}
        selectedRouteName={selectedRouteName}
        selectedSource={selectedSource}
        selectedDestination={selectedDestination}
        onRouteChange={(value) => {
          setSelectedRouteName(value);
          setSelectedSource("");
          setSelectedDestination("");
        }}
        onSourceChange={setSelectedSource}
        onDestinationChange={setSelectedDestination}
        onContinue={handleContinue}
        canContinue={canContinue}
        selectedRoute={selectedRoute}
      />

      <MetroMap
        routes={metroData}
        selectedRouteName={selectedRouteName}
        selectedSource={selectedSource}
        selectedDestination={selectedDestination}
      />
    </div>
  );
};

export default LandingMap;