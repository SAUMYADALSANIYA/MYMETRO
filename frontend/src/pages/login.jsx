import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css"; 

const MetroIconForm = ({ color = "white" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  // Forgot Password States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { email, password }
      );
      const { token, user } = res.data;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.setItem("token", token);
      localStorage.setItem("lastLogin",new Date(res.data.user.lastLogin).toLocaleString());
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "Admin") navigate("/admin");
      else navigate("/customer");
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, "_self");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        { email: forgotEmail }
      );
      setForgotMessage(response.data.message || "Request sent");
    } catch (err) {
      setForgotMessage("Failed to send reset link");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="split-layout-container">
      <div className="split-card">
        
        {/* Left Side: Form */}
        <div className="pane-form">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <div style={{ width: '30px' }}><MetroIconForm color="var(--theme-green)" /></div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)' }}>MY METRO</span>
          </div>

          <h2>Welcome Back</h2>
          
          <button className="btn-google" type="button" onClick={handleGoogleLogin}>
            <svg width="17" height="17" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.5 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 6l6.2 5.2C36.9 40.8 44 35.2 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Log in with Google
          </button>

          <div className="divider"><span>Or login with email</span></div>

          <form onSubmit={handleLogin} noValidate>
            <div className="field">
              <label htmlFor="l-email">Email Address</label>
              <div className="field-input">
                <input
                  id="l-email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="l-password">Password</label>
              <div className="field-input">
                <input
                  id="l-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
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
            </div>

            <div className="row-between">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input type="checkbox" /> Keep me logged in
              </label>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setIsModalOpen(true); setForgotMessage(""); setForgotEmail(""); }} 
                style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}
              >
                Forgot your password?
              </a>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="spin" /> : "Log in"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        {/* Right Side: Animated Banner */}
        <div className="pane-banner">
          <div className="metro-scene">
            <div className="track-line"></div>
            <div className="train-wrapper train-arrive">
              {/* Car 1 */}
              <div className="side-train front-car">
                <div className="side-window cockpit"></div>
                <div className="side-door-frame"><div className="slide-door door-left"><div className="door-glass"></div></div><div className="slide-door door-right"><div className="door-glass"></div></div></div>
                <div className="side-window"></div>
              </div>
              {/* Car 2 */}
              <div className="side-train">
                <div className="side-window"></div>
                <div className="side-door-frame"><div className="slide-door door-left"><div className="door-glass"></div></div><div className="slide-door door-right"><div className="door-glass"></div></div></div>
                <div className="side-window"></div>
              </div>
              {/* Car 3 (Middle Car - ANIMATED DOORS) */}
              <div className="side-train">
                <div className="side-window"></div>
                <div className="side-door-frame">
                  <span className="door-interior-text">HI!</span>
                  <div className="slide-door door-left open-door-left"><div className="door-glass"></div></div>
                  <div className="slide-door door-right open-door-right"><div className="door-glass"></div></div>
                </div>
                <div className="side-window"></div>
              </div>
              {/* Car 4 */}
              <div className="side-train">
                <div className="side-window"></div>
                <div className="side-door-frame"><div className="slide-door door-left"><div className="door-glass"></div></div><div className="slide-door door-right"><div className="door-glass"></div></div></div>
                <div className="side-window"></div>
              </div>
              {/* Car 5 (Back) */}
              <div className="side-train back-car">
                <div className="side-window"></div>
                <div className="side-door-frame"><div className="slide-door door-left"><div className="door-glass"></div></div><div className="slide-door door-right"><div className="door-glass"></div></div></div>
                <div className="side-window cockpit-back"></div>
              </div>
            </div>
          </div>

          <h2>Welcome Back!</h2>
          <p>
            The doors are open. Log in to access your dashboard, track your latest updates, and manage your account.
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '10px', color: 'var(--text-main)', fontSize: '20px' }}>Reset Password</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Enter your email address to receive a password reset link.
            </p>
            
            <form onSubmit={handleForgotPassword}>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={modalInputStyle}
              />
              
              {forgotMessage && (
                <p style={{
                  marginTop: '15px', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textAlign: 'center',
                  backgroundColor: forgotMessage.includes('sent') ? '#ecfdf5' : '#fef2f2',
                  color: forgotMessage.includes('sent') ? '#059669' : '#dc2626',
                  border: `1px solid ${forgotMessage.includes('sent') ? '#a7f3d0' : '#fecaca'}`
                }}>
                  {forgotMessage}
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={modalCancelBtnStyle}>Cancel</button>
                <button type="submit" disabled={forgotLoading} style={modalSubmitBtnStyle}>
                  {forgotLoading ? "Sending..." : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal styles defined here so it doesn't mess with your CSS files
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalContentStyle = {
  backgroundColor: '#fff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
};
const modalInputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f9fafb', color: '#111'
};
const modalCancelBtnStyle = {
  flex: 1, padding: '12px', border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#4b5563', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s'
};
const modalSubmitBtnStyle = {
  flex: 1, padding: '12px', border: 'none', backgroundColor: 'var(--theme-green)', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s'
};

export default Login;