import { useState, useEffect } from "react";
import "./update_fare.css";
const UpdateFare = () => {
  const [fares, setFares] = useState({
    p: "",
    q: "",
    r: "",
    s: "",
    t: ""
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchFare = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/get-fare", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        setFares({
          p: data.p,
          q: data.q,
          r: data.r,
          s: data.s,
          t: data.t
        });

      }
      catch (error){
        console.error("Error fetching fare");
      }
    };

    fetchFare();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFares({
      ...fares,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
      const res = await fetch("http://localhost:5000/api/admin/update-fare", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          p: Number(fares.p),
          q: Number(fares.q),
          r: Number(fares.r),
          s: Number(fares.s),
          t: Number(fares.t)
        })
      });
      const data = await res.json();
      if(res.ok){
        alert("Fare updated successfully!");
      }
      else{
        alert(data.message || "Error updating fare");
      }
    }
    catch (error) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
  <div className="manage-fare-container">
    <h1 className="manage-fare-title">Manage Fare</h1>
    <div className="fare-card">
      <form onSubmit={handleSubmit}>
        {[
          { label: "0 - 5 km", name: "p" },
          { label: "5 - 10 km", name: "q" },
          { label: "10 - 15 km", name: "r" },
          { label: "15 - 25 km", name: "s" },
          { label: "25+ km", name: "t" }
        ].map((item) => (
          <div key={item.name} className="fare-group">
            <label>{item.label}</label>
            <input
              type="number"
              name={item.name}
              value={fares[item.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="update-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Fare"}
        </button>
      </form>
    </div>
  </div>
  );
};

export default UpdateFare;
