import { useEffect, useState } from "react";
import { getTicketHistory } from "./api";
import "./history.css";

export default function CustomerHistory() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="historyPage">
      <h2>My Ticket History</h2>

      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        <table className="historyTable">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => (
              <tr key={t._id}>
                <td>{t.source}</td>
                <td>{t.destination}</td>
                <td>₹{t.farePaid}</td>
                <td>{t.status}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}