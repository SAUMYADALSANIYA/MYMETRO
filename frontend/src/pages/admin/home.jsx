import { useEffect, useState } from "react";
import "./home.css";

const AdminHome = () => {
  const [fare, setFare] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const token = localStorage.getItem("token");

        const fareRes = await fetch(
          "http://localhost:5000/api/admin/get-fare",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const statsRes = await fetch(
          "http://localhost:5000/api/admin/dashboard-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fareData = await fareRes.json();
        const statsData = await statsRes.json();
        if(fareRes.ok) setFare(fareData);
        if(statsRes.ok) setStats(statsData);
      }
      catch(error){
        console.error("Failed to fetch dashboard data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{stats ? stats.totalCustomers : "..."}</p>
        </div>

        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p>{stats ? stats.totalTickets : "..."}</p>
        </div>
      </div>

      {/* Fare Card */}
      <div className="card">
        <h2>Current Fare Slabs</h2>
        {!fare ? (
          <p className="loading-text">Loading fare data...</p>
        ) : (
          <div className="fare-list">
            <div> 1-3 stations: ₹{fare.p}</div>
            <div> 4-6 stations: ₹{fare.q}</div>
            <div> 7-9 stations: ₹{fare.r}</div>
            <div> 10-12 stations: ₹{fare.s}</div>
            <div>12+ stations : ₹{fare.t}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
