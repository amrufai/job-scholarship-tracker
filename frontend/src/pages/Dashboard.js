import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../api/client";

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
        const response = await api.get("/api/applications", {
          headers: authHeaders(token),
        });

        const sortedData = [...response.data].sort((a, b) => {
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
        await api.delete(`/api/applications/${id}`, {
          headers: authHeaders(token),
        });
        // Instantly remove it from the screen without reloading the page
        setApplications((prev) => prev.filter((app) => app.id !== id));
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
      <h2 style={{ marginBottom: 16 }}>Overview</h2>
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <h3 style={{ margin: 0, fontSize: "2.2em" }}>{totalApps}</h3>
          <p style={{ marginTop: 6, color: "var(--muted)", fontWeight: "600", fontSize: "0.85em", textTransform: "uppercase", letterSpacing: "1px" }}>Total Apps</p>
        </div>

        <div className="card" style={{ flex: 1, textAlign: "center", background: "linear-gradient(180deg, rgba(255,243,205,0.8), transparent)" }}>
          <h3 style={{ margin: 0, fontSize: "2.2em", color: "#856404" }}>{interviews}</h3>
          <p style={{ marginTop: 6, color: "#856404", fontWeight: "600", fontSize: "0.85em", textTransform: "uppercase", letterSpacing: "1px" }}>Interviews</p>
        </div>

        <div className="card" style={{ flex: 1, textAlign: "center", background: "linear-gradient(180deg, rgba(212,237,218,0.86), transparent)" }}>
          <h3 style={{ margin: 0, fontSize: "2.2em", color: "#155724" }}>{offers}</h3>
          <p style={{ marginTop: 6, color: "#155724", fontWeight: "600", fontSize: "0.85em", textTransform: "uppercase", letterSpacing: "1px" }}>Offers</p>
        </div>
      </div>

      <div>
        {applications.length === 0 ? (
          <p>No applications tracked yet. Time to start applying!</p>
        ) : (
          <div className="applications-grid">
            {applications.map((app) => (
              <div key={app.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>{app.title}</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => navigate(`/edit/${app.id}`, { state: { app } })} style={{ padding: "6px 10px", cursor: "pointer", backgroundColor: "var(--panel)", border: `1px solid var(--border)`, borderRadius: 6, fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(app.id)} style={{ padding: "6px 10px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: 6, fontWeight: 600 }}>Delete</button>
                  </div>
                </div>

                <p style={{ margin: "6px 0" }}><strong>Organization:</strong> {app.organization}</p>
                <p style={{ margin: "6px 0" }}><strong>Type:</strong> {app.type}</p>
                <p style={{ margin: "6px 0" }}>
                  <strong>Status:</strong>
                  <span style={{ marginLeft: 10, padding: "4px 10px", backgroundColor: getStatusStyle(app.status).bg, color: getStatusStyle(app.status).text, borderRadius: 12, fontSize: "0.9em", fontWeight: 700 }}>{app.status}</span>
                </p>

                {app.date_applied && <p style={{ margin: "8px 0", color: "var(--success)", fontWeight: 700 }}>Applied On: {new Date(app.date_applied).toLocaleDateString()}</p>}
                {app.deadline && <p style={{ margin: "8px 0", color: "#d9534f", fontWeight: 700 }}>Deadline: {new Date(app.deadline).toLocaleDateString()}</p>}

                {app.notes && <p style={{ margin: "10px 0 0 0", fontStyle: "italic", color: "var(--muted)" }}>Notes: {app.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;