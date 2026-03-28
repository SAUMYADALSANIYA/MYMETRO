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
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const strength = getStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!password || password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        { email, password }
      );
      alert("Registration successful!");
      navigate("/");
    }
    catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
    finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
      "_self"
    );
  };

  return (
    <div className="split-layout-container">
      <div className="split-card">
        
        {/* Left Side: Animated Banner */}
        <div className="pane-banner">
          
          <div className="metro-scene">
            {/* Track fades out after train leaves */}
            <div className="track-line track-leave"></div>
            
            <div className="train-wrapper train-leave">
              
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
                  <span className="door-interior-text">GO!</span>
                  <div className="slide-door door-left close-door-left"><div className="door-glass"></div></div>
                  <div className="slide-door door-right close-door-right"><div className="door-glass"></div></div>
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

          {/* This block slides up into the center after the train leaves */}
          <div className="register-text-block">
            <h2>Join the Journey</h2>
            <p>
              Hop on board! Create your account to unlock premium features, stay updated with news, and get moving.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="pane-form">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)' }}>MY METRO</span>
            <div style={{ width: '30px' }}><MetroIconForm color="var(--theme-green)" /></div>
          </div>

          <h2>Create your account</h2>

          <form onSubmit={handleRegister} noValidate>
            
            <div className="field">
              <label htmlFor="r-email">Email</label>
              <div className="field-input">
                <input
                  id="r-email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="r-password">Password</label>
              <div className="field-input">
                <input
                  id="r-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter Password"
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

              {/* Password Strength Meter */}
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

            <div className="row-between" style={{ justifyContent: 'flex-start', gap: '10px' }}>
              <input type="checkbox" required id="terms" />
              <label htmlFor="terms" style={{ margin: 0, fontWeight: 'normal', color: 'var(--text-main)', textTransform: 'none' }}>
                I agree to the Terms and Conditions
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="spin" /> : "Sign Up"}
            </button>
          </form>

          <div className="divider" style={{ marginTop: '25px' }}><span>Sign Up with</span></div>

          {/* Social Icons including Google */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            <button onClick={handleGoogleSignup} style={{ border: 'none', background: 'none', cursor: 'pointer' }} title="Continue with Google">
              <svg width="24" height="24" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.5 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 6l6.2 5.2C36.9 40.8 44 35.2 44 24c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
            </button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;