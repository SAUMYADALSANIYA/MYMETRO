import { useState } from "react";
import axios from "axios";
import "./create_admin.css";

const CreateAdmin = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async () => {
    try{
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/admin/create-admin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `✅ Created: ${res.data.admin.username} | ${res.data.admin.email}`
      );
    }
    catch(error){
      if(error.response?.data?.message){
        setMessage(`❌ ${error.response.data.message}`);
      }
      else{
        setMessage("❌ Failed to create admin");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
  <div className="create-admin-container">
    <h2 className="create-admin-title">Create New Admin</h2>

    <div className="create-admin-card">
      <button
        className="create-admin-btn"
        onClick={handleCreateAdmin}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Admin"}
      </button>

      {message && (
        <p className={message.includes("✅") ? "success" : "error"}>
          {message}
        </p>
      )}
    </div>
  </div>
  );
};

export default CreateAdmin;
