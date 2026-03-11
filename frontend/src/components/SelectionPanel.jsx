import { Link } from "react-router-dom";

const SelectionPanel = ({
  routes,
  selectedRouteName,
  selectedSource,
  selectedDestination,
  onRouteChange,
  onSourceChange,
  onDestinationChange,
  onContinue,
  canContinue,
  selectedRoute
}) => {
  const stationOptions = selectedRoute ? selectedRoute.stations : [];

  const summaryText =
    selectedSource && selectedDestination
      ? `${selectedSource} → ${selectedDestination}`
      : "Choose a route and stations to see journey details.";

  return (
    <div className="selection-panel">
      <div className="selection-panel__header">
        <h1 className="selection-panel__title">MyMetro Ahmedabad</h1>
        <p className="selection-panel__subtitle">
          Explore metro routes, timings, fares, and journey details on the map.
        </p>
      </div>

      <div className="selection-panel__form">
        <div className="selection-panel__field">
          <label htmlFor="routeSelect">Select Route</label>
          <select
            id="routeSelect"
            value={selectedRouteName}
            onChange={(e) => onRouteChange(e.target.value)}
          >
            <option value="">Choose a route</option>
            {routes.map((route) => (
              <option key={route.routeName} value={route.routeName}>
                {route.routeName}
              </option>
            ))}
          </select>
        </div>

        <div className="selection-panel__field">
          <label htmlFor="sourceSelect">Source Station</label>
          <select
            id="sourceSelect"
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            disabled={!selectedRoute}
          >
            <option value="">Choose source</option>
            {stationOptions.map((station) => (
              <option key={station.name} value={station.name}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div className="selection-panel__field">
          <label htmlFor="destinationSelect">Destination Station</label>
          <select
            id="destinationSelect"
            value={selectedDestination}
            onChange={(e) => onDestinationChange(e.target.value)}
            disabled={!selectedRoute}
          >
            <option value="">Choose destination</option>
            {stationOptions.map((station) => (
              <option key={station.name} value={station.name}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="selection-panel__continue"
          onClick={onContinue}
          disabled={!canContinue}
        >
          Continue
        </button>

        <div className="selection-panel__actions">
          <Link
            to="/login"
            className="selection-panel__link selection-panel__link--primary"
          >
            Login
          </Link>
          <Link to="/register" className="selection-panel__link">
            Register
          </Link>
        </div>
      </div>

      <div className="selection-panel__dashboard-card">
        <h2 className="selection-panel__dashboard-title">Journey Summary</h2>
        <p className="selection-panel__summary">{summaryText}</p>

        {selectedRoute ? (
          <>
            <div className="selection-panel__legend">
              <span
                className="selection-panel__legend-color"
                style={{ backgroundColor: selectedRoute.color }}
              />
              <span>{selectedRoute.routeName}</span>
            </div>

            <div className="selection-panel__stats">
              <div className="selection-panel__stat">
                <span className="selection-panel__stat-label">Timing</span>
                <span className="selection-panel__stat-value">
                  {selectedRoute.timing}
                </span>
              </div>

              <div className="selection-panel__stat">
                <span className="selection-panel__stat-label">Frequency</span>
                <span className="selection-panel__stat-value">
                  {selectedRoute.frequency}
                </span>
              </div>

              <div className="selection-panel__stat">
                <span className="selection-panel__stat-label">Fare</span>
                <span className="selection-panel__stat-value">
                  {selectedRoute.fareRange}
                </span>
              </div>

              <div className="selection-panel__stat">
                <span className="selection-panel__stat-label">Duration</span>
                <span className="selection-panel__stat-value">
                  {selectedRoute.estimatedDuration}
                </span>
              </div>

              <div className="selection-panel__stat">
                <span className="selection-panel__stat-label">Stations</span>
                <span className="selection-panel__stat-value">
                  {selectedRoute.stations.length}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="selection-panel__placeholder">
            Select a route to view timings, fare, frequency, and station count.
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectionPanel;