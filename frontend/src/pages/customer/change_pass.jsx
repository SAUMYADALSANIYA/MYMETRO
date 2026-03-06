import { useState } from "react";
import "./change_pass.css";

export default function CustomerChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMsg("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/change-password", {
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

      setMsg("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMsg(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-change-password-page">
      <div className="customer-change-password-card">
        <h1>Change Password</h1>

        {msg && <p className="customer-pass-message">{msg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="customer-pass-field">
            <label>Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
            />
          </div>

          <div className="customer-pass-field">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="customer-pass-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="customer-pass-btn" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}