export default function CustomerMetroCard({ metro, source, destination, onBook }) { // Added onBook here
  // Add a fallback in case stations are undefined
  const stationList = metro.stations || [];
  const stationNames = stationList.map((station) => station.name || station).join(" → ");
  
  const includesSource = source && stationList.some((station) => (station.name || station) === source);
  const includesDestination =
    destination && stationList.some((station) => (station.name || station) === destination);

  // We consider it a "Search Result" if both a source and destination are provided
  const isResult = source && destination;

  return (
    <div className="card">
      <h2 className="cardTitle">{metro.routeName}</h2>

      <div className="cardRow">
        <span className="label">Stations:</span>
        <span className="value">{stationNames}</span>
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
        {/* Fallback to metro.fare if fareRange isn't available */}
        <span className="value">{metro.fareRange || (metro.fare ? `₹${metro.fare}` : "N/A")}</span>
      </div>

      <div className="cardRow">
        <span className="label">Duration:</span>
        <span className="value">{metro.estimatedDuration || "N/A"}</span>
      </div>

      <div className="cardRow">
        <span className="label">Stops:</span>
        {/* Fallback to metro.stops if station array length isn't accurate */}
        <span className="value">{stationList.length > 0 ? `${stationList.length} stations` : (metro.stops || "N/A")}</span>
      </div>

      {(includesSource || includesDestination) && (
        <>
          <div className="divider" />
          <div className="cardRow">
            <span className="label">Journey:</span>
            <span className="value">
              {includesSource ? "Includes source" : ""}
              {includesSource && includesDestination ? " and " : ""}
              {includesDestination ? "includes destination" : ""}
            </span>
          </div>
        </>
      )}

      {/* Added the Book Ticket button logic from main */}
      {isResult && (
        <>
          <div className="divider" />
          <button className="btn bookBtn" onClick={() => onBook?.(metro)} style={{ marginTop: '10px', width: '100%' }}>
            Book Ticket
          </button>
        </>
      )}
    </div>
  );
}