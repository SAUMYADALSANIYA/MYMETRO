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
            <div>0 - 5 km : ₹{fare.p}</div>
            <div>5 - 10 km : ₹{fare.q}</div>
            <div>10 - 15 km : ₹{fare.r}</div>
            <div>15 - 25 km : ₹{fare.s}</div>
            <div>25+ km : ₹{fare.t}</div>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="card">
        <h2>System Status</h2>
        <p className="status-text success">✔ Metro Fare System Active</p>
        <p className="status-text success">✔ Admin Access Verified</p>
      </div>
    </div>
  );
};

export default AdminHome;
