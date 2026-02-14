import { useEffect, useState } from "react";
import "./home.css";

const AdminHome = () => {
  const [fare, setFare] = useState(null);

  useEffect(() => {
    const fetchFare = async () => {
      try{
        const res = await fetch("http://localhost:5000/api/admin/get-fare", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        if(res.ok){
          setFare(data);
        }
      }
      catch(error){
        console.error("Failed to fetch fare");
      }
    };

    fetchFare();
  }, []);
  return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Admin Dashboard</h1>

    <div className="card">
      <h2>Current Fare Slabs</h2>
      {!fare ?(
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
    <div className="card">
      <h2>System Status</h2>
      <p className="status-text">✔ Metro Fare System Active</p>
      <p className="status-text">✔ Admin Access Verified</p>
    </div>
  </div>
  );

};

export default AdminHome;
