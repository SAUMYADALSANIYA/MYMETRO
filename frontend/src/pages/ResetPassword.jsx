import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./login.css";

const MetroIconForm = ({ color = "white" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="5" width="16" height="11" rx="3" stroke={color} strokeWidth="1.8" fill="none"/>
    <rect x="6.5" y="8" width="4" height="3.5" rx="1" fill={color} fillOpacity="0.9"/>
    <rect x="13.5" y="8" width="4" height="3.5" rx="1" fill={color} fillOpacity="0.9"/>
    <circle cx="8.5" cy="18.5" r="1.8" stroke={color} strokeWidth="1.6" fill="none"/>
    <circle cx="15.5" cy="18.5" r="1.8" stroke={color} strokeWidth="1.6" fill="none"/>
    <line x1="3" y1="21" x2="21" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="5" x2="12" y2="16" stroke={color} strokeWidth="1.2" strokeOpacity="0.4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      setSuccess(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage("Password updated successfully! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setSuccess(false);
        setMessage(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f4f6f3',
      padding: '24px'
    }}>
      
      <div className="auth-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
        <div className="auth-brand-icon" style={{
          width: '38px', height: '38px', backgroundColor: '#16a34a', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <MetroIconForm color="white" />
        </div>
        <span className="auth-brand-name" style={{ fontSize: '18px', fontWeight: '700', color: '#111', letterSpacing: '-0.3px' }}>
          MyMetro
        </span>
      </div>

      <div className="auth-card" style={{
        backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e4e7e1', 
        padding: '36px 32px', width: '100%', maxWidth: '400px', 
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Reset Password
        </h2>
        <p className="subtitle" style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Enter a new password for your account.
        </p>

        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: success ? '#ecfdf5' : '#fef2f2',
            color: success ? '#16a34a' : '#dc2626',
            border: `1px solid ${success ? '#bbf7d0' : '#fecaca'}`
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="new-password">NEW PASSWORD</label>
            <div className="field-input has-toggle">
              <input
                id="new-password"
                type={showPw ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={success}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
              >
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="field" style={{ marginTop: '14px' }}>
            <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
            <div className="field-input has-toggle">
              <input
                id="confirm-password"
                type={showConfirmPw ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={success}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowConfirmPw(v => !v)}
                tabIndex={-1}
              >
                {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading || success} style={{ marginTop: '20px' }}>
            {loading ? <span className="spin" /> : success ? "Updated" : "Update Password"}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
          Remember your password? <Link to="/login" style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;