import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStations, validateExit } from "./api";

export default function ScanTicketPage() {
  const { token } = useParams();
  const navigate = useNavigate();

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

  async function handleValidate() {
    try {
      setMessage("");
      setExtraTrip(null);

      const data = await validateExit(token, exitStation);
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
    <div style={{ padding: "30px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Scan Ticket</h1>

      <p><b>QR Token:</b> {token}</p>

      <label>Select actual exit station</label>
      <select
        value={exitStation}
        onChange={(e) => setExitStation(e.target.value)}
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      >
        <option value="">Select exit station</option>
        {stations.map((st) => (
          <option key={st} value={st}>{st}</option>
        ))}
      </select>

      <button
        onClick={handleValidate}
        style={{
          width: "100%",
          marginTop: "16px",
          padding: "12px",
          background: "#111",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}
      >
        Validate Ticket
      </button>

      {message && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
          {message}
        </div>
      )}

      {extraTrip && (
        <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "16px", borderRadius: "10px" }}>
          <p><b>Extra fare required</b></p>
          <p>{extraTrip.source} → {extraTrip.destination}</p>
          <p>Stops: {extraTrip.stops}</p>
          <p>Fare: ₹{extraTrip.fare}</p>

          <button
            onClick={() => navigate("/customer/payment", { state: extraTrip })}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "12px",
              background: "#0ea5e9",
              color: "white",
              border: "none",
              borderRadius: "8px"
            }}
          >
            Pay Extra Fare
          </button>
        </div>
      )}
    </div>
  );
}