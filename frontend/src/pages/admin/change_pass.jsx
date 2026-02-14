import { useState } from "react";
import "./change_pass.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/change-pass", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password updated successfully");
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Current Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Update Password</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ChangePassword;
