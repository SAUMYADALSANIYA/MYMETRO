export default function CustomerMetroCard({ metro, source, destination, onBook }) {
  const stationList = metro.stations || [];
  
  // Create a beautifully formatted string with slight spacing
  const stationNames = stationList.map((station) => station.name || station).join("  →  ");
  
  const includesSource = source && stationList.some((station) => (station.name || station) === source);
  const includesDestination =
    destination && stationList.some((station) => (station.name || station) === destination);

  const isResult = source && destination;

  return (
    <div className="card">
      <h2 className="cardTitle">{metro.routeName}</h2>

      {/* Wrapping the data in a scrollable area so it never pushes the button out of view */}
      <div className="card-scroll-area">
        
        {/* Stations are shown prominently at the top but with lighter font weight */}
        <div className="cardRow" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
          <span className="label" style={{ marginBottom: '6px' }}>Route Stations:</span>
          <span className="value station-list-value" style={{ textAlign: 'left' }}>
            {stationNames}
          </span>
        </div>

        <div className="cardRow">
          <span className="label">Timing:</span>
          <span className="value">{metro.timing || "Not available"}</span>
        </div>

        <div className="cardRow">
          <span className="label">Frequency:</span>
          <span className="value">{metro.frequency || "Not available"}</span>
        </div>

        <div className="cardRow">
          <span className="label">Fare:</span>
          <span className="value">{metro.fareRange || (metro.fare ? `₹${metro.fare}` : "N/A")}</span>
        </div>

        <div className="cardRow">
          <span className="label">Duration:</span>
          <span className="value">{metro.estimatedDuration || "N/A"}</span>
        </div>

        <div className="cardRow">
          <span className="label">Stops:</span>
          <span className="value">{stationList.length > 0 ? `${stationList.length} stations` : (metro.stops || "N/A")}</span>
        </div>

        {(includesSource || includesDestination) && (
          <div className="cardRow">
            <span className="label">Journey:</span>
            <span className="value">
              {includesSource ? "Includes start" : ""}
              {includesSource && includesDestination ? " & " : ""}
              {includesDestination ? "destination" : ""}
            </span>
          </div>
        )}
      </div>

      {isResult && (
        <button className="btn bookBtn" onClick={() => onBook?.(metro)}>
          Book Ticket
        </button>
      )}
    </div>
  );
}