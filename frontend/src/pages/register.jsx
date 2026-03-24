// src/pages/register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./register.css";

const MetroIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="5" width="16" height="11" rx="3" stroke="white" strokeWidth="1.8" fill="none"/>
    <rect x="6.5" y="8" width="4" height="3.5" rx="1" fill="white" fillOpacity="0.9"/>
    <rect x="13.5" y="8" width="4" height="3.5" rx="1" fill="white" fillOpacity="0.9"/>
    <circle cx="8.5" cy="18.5" r="1.8" stroke="white" strokeWidth="1.6" fill="none"/>
    <circle cx="15.5" cy="18.5" r="1.8" stroke="white" strokeWidth="1.6" fill="none"/>
    <line x1="3" y1="21" x2="21" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="5" x2="12" y2="16" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f59e0b", "#3b82f6", "#16a34a"];

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const strength = getStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        { username, email, password }
      );
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Brand */}
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <MetroIcon />
        </div>
        <span className="auth-brand-name">MY METRO</span>
      </div>

      {/* Card */}
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="subtitle">Get started — it only takes a minute</p>

        <form onSubmit={handleRegister} noValidate>
          {/* Username */}
          <div className="field">
            <label htmlFor="r-username">Username</label>
            <div className="field-input">
              <input
                id="r-username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="field">
            <label htmlFor="r-email">Email</label>
            <div className="field-input">
              <input
                id="r-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="r-password">Password</label>
            <div className="field-input has-toggle">
              <input
                id="r-password"
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
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

            {/* Strength meter */}
            {password && (
              <div className="strength-row">
                <div className="strength-bars">
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className="strength-bar"
                      style={{ background: i <= strength ? STRENGTH_COLORS[strength] : "#e5e7eb" }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="spin" /> : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
        <p className="terms">
          By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;