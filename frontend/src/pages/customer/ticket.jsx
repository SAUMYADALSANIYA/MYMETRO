import { useLocation, useNavigate } from "react-router-dom";
import "./ticket.css";

export default function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state?.ticket;

  if (!ticket) {
    return (
      <div className="ticketPage">
        <h2>No ticket found</h2>
        <button onClick={() => navigate("/customer")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="ticketPage">
      <div className="ticketCard">
        <h1>Your Metro QR Ticket</h1>

        <div className="ticketRow"><span>Route</span><span>{ticket.routeName}</span></div>
        <div className="ticketRow"><span>From</span><span>{ticket.source}</span></div>
        <div className="ticketRow"><span>To</span><span>{ticket.destination}</span></div>
        <div className="ticketRow"><span>Fare Paid</span><span>₹{ticket.farePaid}</span></div>
        <div className="ticketRow"><span>Status</span><span>{ticket.status}</span></div>

        <div className="qrBox">
          <img src={ticket.qrCodeDataUrl} alt="QR Ticket" />
        </div>

        <div className="ticketRow">
          <span>Scan URL</span>
          <span style={{ wordBreak: "break-all", fontSize: "12px" }}>{ticket.scanUrl}</span>
        </div>

        <button
          className="demoBtn"
          onClick={() => navigate("/customer/scan/" + ticket.qrToken)}
        >
          Open Scan Page on this device
        </button>
      </div>
    </div>
  );
}