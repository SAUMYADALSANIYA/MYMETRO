import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetroMap from "../components/MetroMap";
import SelectionPanel from "../components/SelectionPanel";
import { ahmedabadMetroData } from "../data/ahmedabadMetroData";
import "./LandingMap.css";

const LandingMap = () => {
  const navigate = useNavigate();

  const [selectedRouteName, setSelectedRouteName] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const selectedRoute = useMemo(() => {
    return ahmedabadMetroData.find(
      (route) => route.routeName === selectedRouteName
    );
  }, [selectedRouteName]);

  const canContinue =
    selectedRouteName &&
    selectedSource &&
    selectedDestination &&
    selectedSource !== selectedDestination;

  const handleContinue = () => {
    if (!canContinue) return;

    const tripSelection = {
      routeName: selectedRouteName,
      source: selectedSource,
      destination: selectedDestination,
      selectedAt: new Date().toISOString()
    };

    localStorage.setItem("metroTripSelection", JSON.stringify(tripSelection));
    navigate("/login");
  };

  return (
    <div className="landing-map-page">
      <SelectionPanel
        routes={ahmedabadMetroData}
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
        routes={ahmedabadMetroData}
        selectedRouteName={selectedRouteName}
        selectedSource={selectedSource}
        selectedDestination={selectedDestination}
      />
    </div>
  );
};

export default LandingMap;