import { useEffect, useState } from "react";
import axios from "axios";
import "./view_users.css";

const ViewUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [loadingJourneys, setLoadingJourneys] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const res = await axios.get(
          `http://localhost:5000/api/admin/get-users?search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(res.data);
      }
      catch(error){
        console.error(error);
      }
    };

    fetchUsers();
  }, [search]);

  const handleUserClick = async (userId) => {
    if(selectedUser === userId){
      setSelectedUser(null);
      setJourneys([]);
      return;
    }

    try{
      setLoadingJourneys(true);
      setSelectedUser(userId);

      const res = await axios.get(
        `http://localhost:5000/api/admin/user/${userId}/journeys`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setJourneys(res.data);
    }
    catch(error){
      console.error(error);
    }
    finally {
      setLoadingJourneys(false);
    }
  };

  return (
    <div className="view-users-wrapper">
      <h2 className="view-users-title">View Users</h2>

      <div className="view-users-container">
        <input
          type="text"
          placeholder="Search customer by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="users-list">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="user-card-wrapper">
                <div
                  className="user-card clickable"
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="user-email">{user.email}</div>
                  <div className="user-role">Role: {user.role}</div>
                </div>

                {selectedUser === user._id && (
                  <div className="journeys-section">
                    {loadingJourneys ? (
                      <div className="loading">Loading journeys...</div>
                    ) : journeys.length > 0 ? (
                      journeys.map((journey) => (
                        <div key={journey._id} className="journey-card">
                          <div>
                            {journey.source} → {journey.destination}
                          </div>
                          <div className="journey-date">
                            {new Date(
                              journey.journeyDate
                            ).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        No journeys found
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
