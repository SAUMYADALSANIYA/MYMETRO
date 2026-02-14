import { Outlet, useNavigate } from "react-router-dom";
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

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangePassword = () => {
    navigate("/admin/change-password");
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2>MyMetro Admin</h2>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <button onClick={() => navigate("/admin")}>Dashboard</button>
          <button onClick={() => navigate("/admin/create-admin")}>Create Admin</button>
          <button onClick={() => navigate("/admin/manage-schedule")}>Manage Schedule</button>
          <button onClick={() => navigate("/admin/manage-fare")}>Manage Fare</button>
          <button onClick={() => navigate("/admin/view-users")}>View Users</button>
        </div>

        {/* Bottom Section */}
        <div className="bottom-buttons">
          <button className="change-password-btn" onClick={handleChangePassword}>
            Change Password
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div>Welcome, Admin</div>
          <div>Last Login: {lastLogin || "First Login"}</div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
