import { useState } from "react";
import "./change_pass.css";

// Reusing the modern Eye Icons from Auth pages
const EyeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CustomerChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'error' or 'success'
  const [loading, setLoading] = useState(false);

  // Toggle states for showing/hiding passwords
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMsg("Please fill all fields");
      setMsgType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("New password and confirm password do not match");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setMsg("Password changed successfully!");
      setMsgType("success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMsg(error.message || "Something went wrong");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-change-password-page">
      <div className="customer-change-password-card">
        
        <div className="card-header">
          <h1>Change Password</h1>
          <p>Ensure your account is using a long, random password to stay secure.</p>
        </div>

        {msg && (
          <div className={`customer-pass-message ${msgType}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          
          {/* Old Password */}
          <div className="customer-pass-field">
            <label>Current Password</label>
            <div className="input-wrapper">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button 
                type="button" 
                className="eye-toggle" 
                onClick={() => setShowOld(!showOld)}
                tabIndex="-1"
              >
                {showOld ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="customer-pass-field">
            <label>New Password</label>
            <div className="input-wrapper">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
              />
              <button 
                type="button" 
                className="eye-toggle" 
                onClick={() => setShowNew(!showNew)}
                tabIndex="-1"
              >
                {showNew ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="customer-pass-field">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button 
                type="button" 
                className="eye-toggle" 
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex="-1"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="customer-pass-btn" disabled={loading}>
            {loading ? <span className="loader-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}