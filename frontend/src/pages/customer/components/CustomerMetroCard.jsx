export default function CustomerMetroCard({ metro, source, destination }) {
  const stationNames = metro.stations.map((station) => station.name).join(" → ");
  const includesSource = source && metro.stations.some((station) => station.name === source);
  const includesDestination =
    destination && metro.stations.some((station) => station.name === destination);

  return (
    <div className="card">
      <h2 className="cardTitle">{metro.routeName}</h2>

      <div className="cardRow">
        <span className="label">Stations:</span>
        <span className="value">{stationNames}</span>
      </div>

      <div className="cardRow">
        <span className="label">Timing:</span>
        <span className="value">{metro.timing}</span>
      </div>

      <div className="cardRow">
        <span className="label">Frequency:</span>
        <span className="value">{metro.frequency}</span>
      </div>

      <div className="cardRow">
        <span className="label">Fare:</span>
        <span className="value">{metro.fareRange}</span>
      </div>

      <div className="cardRow">
        <span className="label">Duration:</span>
        <span className="value">{metro.estimatedDuration}</span>
      </div>

      <div className="cardRow">
        <span className="label">Stops:</span>
        <span className="value">{metro.stations.length} stations</span>
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
    </div>
  );
}