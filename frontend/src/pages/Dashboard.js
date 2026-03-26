import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const getStatusStyle = (status) => {
    switch (status) {
      case "Offer": return { bg: "#d4edda", text: "#155724" }; // Green
      case "Rejected": return { bg: "#f8d7da", text: "#721c24" }; // Red
      case "Interview Scheduled": return { bg: "#fff3cd", text: "#856404" }; // Yellow
      case "Applied": return { bg: "#cce5ff", text: "#004085" }; // Blue
      default: return { bg: "#e2e3e5", text: "#383d41" }; // Grey for Wishlist
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("https://job-scholarship-tracker.onrender.com/api/applications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // NEW: The Deadline Radar Sorting Logic
        const sortedData = response.data.sort((a, b) => {
          // If an application has no deadline, push it to the bottom of the list
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          
          // Otherwise, sort them so the closest date is at the top
          return new Date(a.deadline) - new Date(b.deadline);
        });

        setApplications(sortedData);
      } catch (err) {
        setError("Failed to fetch applications. Your session might have expired.");
      }
    };
    fetchApplications();
  }, [navigate]);

  // NEW: Function to handle deleting an application
  const handleDelete = async (id) => {
    // Show a quick browser confirmation pop-up first
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://job-scholarship-tracker.onrender.com/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Instantly remove it from the screen without reloading the page
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        alert("Failed to delete application.");
      }
    }
  };

  // NEW: Calculate the Command Center Stats
  const totalApps = applications.length;
  const interviews = applications.filter(app => app.status === "Interview Scheduled").length;
  const offers = applications.filter(app => app.status === "Offer").length;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Overview</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* NEW: Command Center Stats Row */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
        
        {/* Total Box */}
        <div style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          <h3 style={{ margin: "0", fontSize: "2.2em", color: "#1a1a2e" }}>{totalApps}</h3>
          <p style={{ margin: "5px 0 0 0", color: "#555", fontWeight: "bold", fontSize: "0.9em", textTransform: "uppercase", letterSpacing: "1px" }}>Total Apps</p>
        </div>

        {/* Interviews Box (Yellow) */}
        <div style={{ flex: 1, backgroundColor: "#fff3cd", padding: "20px", borderRadius: "8px", border: "1px solid #ffeeba", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          <h3 style={{ margin: "0", fontSize: "2.2em", color: "#856404" }}>{interviews}</h3>
          <p style={{ margin: "5px 0 0 0", color: "#856404", fontWeight: "bold", fontSize: "0.9em", textTransform: "uppercase", letterSpacing: "1px" }}>Interviews</p>
        </div>

        {/* Offers Box (Green) */}
        <div style={{ flex: 1, backgroundColor: "#d4edda", padding: "20px", borderRadius: "8px", border: "1px solid #c3e6cb", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          <h3 style={{ margin: "0", fontSize: "2.2em", color: "#155724" }}>{offers}</h3>
          <p style={{ margin: "5px 0 0 0", color: "#155724", fontWeight: "bold", fontSize: "0.9em", textTransform: "uppercase", letterSpacing: "1px" }}>Offers</p>
        </div>

      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {applications.length === 0 ? (
          <p>No applications tracked yet. Time to start applying!</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              
              {/* NEW: Flexbox to align the title left and buttons right */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <h3 style={{ margin: "0", color: "#1a1a2e" }}>{app.title}</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* The Edit button passes the current 'app' data to the new page */}
                  <button onClick={() => navigate(`/edit/${app.id}`, { state: { app } })} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#f1ebd9", border: "none", borderRadius: "4px", fontWeight: "bold" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(app.id)} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold" }}>
                    Delete
                  </button>
                </div>
              </div>

              <p style={{ margin: "5px 0" }}><strong>Organization:</strong> {app.organization}</p>
              <p style={{ margin: "5px 0" }}><strong>Type:</strong> {app.type}</p>
              <p style={{ margin: "5px 0" }}>
                <strong>Status:</strong> 
                <span style={{ 
                  marginLeft: "10px", 
                  padding: "4px 10px", 
                  backgroundColor: getStatusStyle(app.status).bg, 
                  color: getStatusStyle(app.status).text,
                  borderRadius: "12px", 
                  fontSize: "0.9em",
                  fontWeight: "bold"
                }}>
                  {app.status}
                </span>
              </p>

              {app.date_applied && <p style={{ margin: "8px 0", color: "#28a745", fontWeight: "bold" }}>Applied On: {new Date(app.date_applied).toLocaleDateString()}</p>}
              {app.deadline && <p style={{ margin: "8px 0", color: "#d9534f", fontWeight: "bold" }}>Deadline: {new Date(app.deadline).toLocaleDateString()}</p>}

              {app.notes && <p style={{ margin: "10px 0 0 0", fontStyle: "italic", color: "#555" }}>Notes: {app.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;