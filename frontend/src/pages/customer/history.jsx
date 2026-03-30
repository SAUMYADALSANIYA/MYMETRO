import { useEffect, useState } from "react";
import { getTicketHistory } from "./api";
import "./history.css";

const StatusBadge = ({ status }) => {
  const isActive = status === "ACTIVE";
  return (
    <span className={`statusBadge ${isActive ? "statusActive" : "statusInactive"}`}>
      <span className="statusDot" />
      {status}
    </span>
  );
};

const TicketCard = ({ ticket, index }) => {
  const date = new Date(ticket.createdAt);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="ticketCard" style={{ "--delay": `${index * 60}ms` }}>
      <div className="ticketLeft">
        <div className="ticketIndex">#{String(index + 1).padStart(2, "0")}</div>
        <div className="routeBlock">
          <div className="stationRow">
            <span className="stationDot from" />
            <span className="stationName">{ticket.source}</span>
          </div>
          <div className="routeLine" />
          <div className="stationRow">
            <span className="stationDot to" />
            <span className="stationName">{ticket.destination}</span>
          </div>
        </div>
      </div>

      <div className="ticketDivider">
        <div className="dividerCircle top" />
        <div className="dividerDash" />
        <div className="dividerCircle bottom" />
      </div>

      <div className="ticketRight">
        <div className="fareBlock">
          <span className="fareLabel">Fare Paid</span>
          <span className="fareAmount">₹{ticket.farePaid}</span>
        </div>
        <StatusBadge status={ticket.computedStatus} />
        <div className="dateBlock">
          <span className="dateValue">{formattedDate}</span>
          <span className="timeValue">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default function CustomerHistory() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getTicketHistory()
      .then((data) => {
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "ALL" ? tickets : tickets.filter((t) => t.computedStatus === filter);

  const totalFare = tickets.reduce((sum, t) => sum + (t.farePaid || 0), 0);
  const activeCount = tickets.filter((t) => t.computedStatus === "ACTIVE").length;

  if (loading)
    return (
      <div className="loadingState">
        <div className="loadingSpinner" />
        <p>Fetching your journeys…</p>
      </div>
    );

  if (error)
    return (
      <div className="errorState">
        <span className="errorIcon">⚠</span>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="historyPage">
      {/* Header */}
      <div className="historyHeader">
        <div className="headerText">
          <h2 className="historyTitle">Journey History</h2>
          <p className="historySubtitle">All your Ahmedabad Metro trips</p>
        </div>
        <div className="statsRow">
          <div className="statPill">
            <span className="statNum">{tickets.length}</span>
            <span className="statLabel">Total Trips</span>
          </div>
          <div className="statPill">
            <span className="statNum">₹{totalFare}</span>
            <span className="statLabel">Total Spent</span>
          </div>
          <div className="statPill active">
            <span className="statNum">{activeCount}</span>
            <span className="statLabel">Active</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="filterTabs">
        {["ALL", "ACTIVE", "INACTIVE"].map((f) => (
          <button
            key={f}
            className={`filterTab ${filter === f ? "filterTabActive" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="emptyState">
          <div className="emptyIcon">🚇</div>
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="ticketList">
          {filtered.map((t, i) => (
            <TicketCard key={t._id} ticket={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}








