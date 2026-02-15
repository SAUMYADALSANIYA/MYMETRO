import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    const previousLogin = localStorage.getItem("lastLogin");
    setLastLogin(previousLogin);

    const now = new Date().toLocaleString();
    localStorage.setItem("lastLogin", now);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>MyMetro Admin</h2>

        <nav className="nav-links">
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Dashboard
          </NavLink>

          <NavLink 
            to="/admin/update-fare"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Manage Fare
          </NavLink>

          <NavLink 
            to="/admin/change-password"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Change Password
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main">
        <div className="topbar">
          <div>Welcome, Admin</div>
          <div>
            Last Login: {lastLogin ? lastLogin : "First Login"}
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
