import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("lastLogin",new Date(res.data.user.lastLogin).toLocaleString());
      localStorage.setItem("role", user.role);

      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>User Login</h2>
        <div className="dots">•••</div>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;