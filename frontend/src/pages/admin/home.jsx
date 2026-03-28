import { useEffect, useState } from "react";
import "./home.css";

const AdminHome = () => {
  const [fare, setFare] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const fareRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/get-fare`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const statsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fareData = await fareRes.json();
        const statsData = await statsRes.json();
        
        if (fareRes.ok) setFare(fareData);
        if (statsRes.ok) setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Overview of system statistics and current configurations.</p>
      </div>

      {/* Stats Cards Row (Centered) */}
      <div className="stats-grid">
        
        {/* Customers Stat */}
        <div className="stat-card">
          <div className="stat-icon customer-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>TOTAL CUSTOMERS</h3>
            <p>{stats ? stats.totalCustomers : "..."}</p>
          </div>
        </div>

        {/* Tickets Stat */}
        <div className="stat-card">
          <div className="stat-icon ticket-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-1.99 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-6 7.5H8v-2h8v2zm0-5H8v-2h8v2zm0-5H8v-2h8v2z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>TOTAL TICKETS</h3>
            <p>{stats ? stats.totalTickets : "..."}</p>
          </div>
        </div>

      </div>

      {/* Centered Fare Card */}
      <div className="dashboard-bottom-row">
        <div className="card fare-card">
          <div className="card-header">
            <h2>Current Fare Slabs</h2>
            <span className="badge-active">ACTIVE</span>
          </div>
          
          {!fare ? (
            <p className="loading-text">Loading fare data...</p>
          ) : (
            <div className="fare-list">
              <div className="fare-item"> 
                <span className="fare-label">1-3 stations</span> 
                <span className="fare-value">₹{fare.p}</span>
              </div>
              <div className="fare-item"> 
                <span className="fare-label">4-6 stations</span> 
                <span className="fare-value">₹{fare.q}</span>
              </div>
              <div className="fare-item"> 
                <span className="fare-label">7-9 stations</span> 
                <span className="fare-value">₹{fare.r}</span>
              </div>
              <div className="fare-item"> 
                <span className="fare-label">10-12 stations</span> 
                <span className="fare-value">₹{fare.s}</span>
              </div>
              <div className="fare-item"> 
                <span className="fare-label">12+ stations</span> 
                <span className="fare-value">₹{fare.t}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default AdminHome;