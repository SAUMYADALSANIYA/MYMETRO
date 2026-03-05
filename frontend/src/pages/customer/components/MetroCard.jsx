import "./../home.css";

export default function MetroCard({ metro, isResult = false, onBook }) {
  return (
    <div className="card">
      <div className="cardTitle">{metro.routeName}</div>

      <div className="cardRow">
        <span className="label">Stations:</span>
        <span className="value">{(metro.stations || []).join(" → ")}</span>
      </div>

      <div className="cardRow">
        <span className="label">Timing:</span>
        <span className="value">
          {metro.schedule ? `${metro.schedule.startTime} - ${metro.schedule.endTime}` : "Not available"}
        </span>
      </div>

      <div className="cardRow">
        <span className="label">Frequency:</span>
        <span className="value">
          {metro.schedule ? `Every ${metro.schedule.frequencyMins} mins` : "Not available"}
        </span>
      </div>

      {isResult && (
        <>
          <div className="divider" />

          <div className="cardRow">
            <span className="label">Trip:</span>
            <span className="value">{metro.source} → {metro.destination}</span>
          </div>

          <div className="cardRow">
            <span className="label">Stops:</span>
            <span className="value">{metro.stops}</span>
          </div>

          <div className="cardRow">
            <span className="label">Fare:</span>
            <span className="value">₹{metro.fare}</span>
          </div>

          <button className="btn bookBtn" onClick={() => onBook?.(metro)}>
            Book Ticket
          </button>
        </>
      )}
    </div>
  );
}