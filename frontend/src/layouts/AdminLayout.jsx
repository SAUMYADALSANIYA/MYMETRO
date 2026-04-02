import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [lastLogin, setLastLogin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("lastLogin");
    setLastLogin(storedLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-container">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <h2><span>MyMetro</span> Admin</h2>

        <nav className="nav-links">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "active-link" : ""} onClick={closeSidebar}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/update-fare" className={({ isActive }) => isActive ? "active-link" : ""} onClick={closeSidebar}>
            Manage Fare
          </NavLink>
          <NavLink to="/admin/ManageAdmin" className={({ isActive }) => isActive ? "active-link" : ""} onClick={closeSidebar}>
            View Admin List
          </NavLink>
          <NavLink to="/admin/view-users" className={({ isActive }) => isActive ? "active-link" : ""} onClick={closeSidebar}>
            View Users
          </NavLink>
          <NavLink to="/admin/change-password" className={({ isActive }) => isActive ? "active-link" : ""} onClick={closeSidebar}>
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
          <div className="topbar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Toggle sidebar"
            >
              <span /><span /><span />
            </button>
            <span className="topbar-welcome">Welcome, Admin</span>
          </div>
          <div className="topbar-login">
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