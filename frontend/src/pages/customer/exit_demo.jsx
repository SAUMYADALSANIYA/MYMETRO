import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStations, validateExit } from "./api";
import "./exit_demo.css";

export default function ExitDemoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state?.ticket;

  const [stations, setStations] = useState([]);
  const [exitStation, setExitStation] = useState("");
  const [message, setMessage] = useState("");
  const [extraTrip, setExtraTrip] = useState(null);

  useEffect(() => {
    loadStations();
  }, []);

  async function loadStations() {
    try {
      const data = await getAllStations();
      setStations(data.stations || []);
    } catch (e) {
      console.error(e);
    }
  }

  if (!ticket) {
    return (
      <div className="exitPage">
        <h2>No ticket found</h2>
        <button onClick={() => navigate("/customer")}>Go Back</button>
      </div>
    );
  }

  async function handleValidate() {
    try {
      setMessage("");
      setExtraTrip(null);

      const data = await validateExit(ticket.qrToken, exitStation);
      setMessage(data.message || "Exit allowed");
    } catch (e) {
      console.error(e);
      setMessage(e.message || "Validation failed");

      if (e.extraRequired && e.extraTrip) {
        setExtraTrip(e.extraTrip);
      }
    }
  }

  return (
    <div className="exitPage">
      <div className="exitCard">
        <h1>Exit Validation Demo</h1>

        <p><b>Booked Ticket:</b> {ticket.source} → {ticket.destination}</p>
        <p><b>Current QR Status:</b> {ticket.status}</p>

        <label>Select actual exit station</label>
        <select value={exitStation} onChange={(e) => setExitStation(e.target.value)}>
          <option value="">Select exit station</option>
          {stations.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <button className="validateBtn" onClick={handleValidate}>
          Validate Exit
        </button>

        {message && <div className="exitMsg">{message}</div>}

        {extraTrip && (
          <div className="extraBox">
            <p><b>Extra fare required</b></p>
            <p>{extraTrip.source} → {extraTrip.destination}</p>
            <p>Stops: {extraTrip.stops}</p>
            <p>Extra Fare: ₹{extraTrip.fare}</p>

            <button
              className="payExtraBtn"
              onClick={() => navigate("/customer/payment", { state: extraTrip })}
            >
              Pay Extra Fare
            </button>
          </div>
        )}
      </div>
    </div>
  );
}