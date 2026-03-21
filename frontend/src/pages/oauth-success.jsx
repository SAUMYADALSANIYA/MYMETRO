// src/pages/oauth-success.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setTimeout(() => navigate("/customer"), 1000);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #e4e7e1",
        padding: "40px 36px",
        textAlign: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        minWidth: "280px",
      }}>
        {/* Brand mark */}
        <div style={{
          width: "44px", height: "44px",
          background: "#16a34a",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "4px",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="11" rx="3" stroke="white" strokeWidth="1.8" fill="none"/>
            <rect x="6.5" y="8" width="4" height="3.5" rx="1" fill="white" fillOpacity="0.9"/>
            <rect x="13.5" y="8" width="4" height="3.5" rx="1" fill="white" fillOpacity="0.9"/>
            <circle cx="8.5" cy="18.5" r="1.8" stroke="white" strokeWidth="1.6" fill="none"/>
            <circle cx="15.5" cy="18.5" r="1.8" stroke="white" strokeWidth="1.6" fill="none"/>
            <line x1="3" y1="21" x2="21" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Spinner */}
        <div style={{
          width: "24px", height: "24px",
          border: "2.5px solid #d1fae5",
          borderTopColor: "#16a34a",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />

        <p style={{ fontSize: "16px", fontWeight: "600", color: "#111", margin: 0 }}>
          Signing you in{dots}
        </p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          Completing Google authentication
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
