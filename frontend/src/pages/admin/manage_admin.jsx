import { useState, useEffect } from "react";
import axios from "axios";
import "./manage_admin.css";

const ManageAdmin = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [fetching, setFetching] = useState(false);

  const token = localStorage.getItem("token");

  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      setMessage("");

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

      fetchAdmins(); // refresh list
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Failed to create admin");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setFetching(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/get-admins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmins(res.data);
    } catch (error) {
      setMessage("❌ Failed to fetch admins");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="create-admin-container">
      <h2 className="create-admin-title">Admin Management</h2>
      <div className="admin-list-card">
        <h3>Admin List</h3>

        {fetching ? (
          <p>Loading...</p>
        ) : admins.length === 0 ? (
          <p>No admins found</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={index}>
                  <td>{admin.email}</td>
                  <td>
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleString()
                      : "Never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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

export default ManageAdmin;