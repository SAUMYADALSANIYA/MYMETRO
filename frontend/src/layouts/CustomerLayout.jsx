import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CustomerLayout.css";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/");
      return;
    }

    if (role && role !== "Customer") {
      navigate("/");
      return;
    }

    const previousLogin = localStorage.getItem("customerLastLogin");
    setLastLogin(previousLogin || "First Login");

    const now = new Date().toLocaleString();
    localStorage.setItem("customerLastLogin", now);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("customerLastLogin");
    navigate("/");
  };

  return (
    <div className="customer-layout-container">
      <aside className="customer-sidebar">
        <h2>MyMetro Customer</h2>

        <nav className="customer-nav-links">
          <NavLink
            to="/customer"
            end
            className={({ isActive }) =>
              isActive ? "customer-active-link" : ""
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/customer/change-password"
            className={({ isActive }) =>
              isActive ? "customer-active-link" : ""
            }
          >
            Change Password
          </NavLink>
        </nav>

        <button className="customer-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="customer-main">
        <div className="customer-topbar">
          <div>Welcome, Customer</div>
          <div>Last Login: {lastLogin}</div>
        </div>

        <div className="customer-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;