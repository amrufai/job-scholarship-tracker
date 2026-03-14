import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // State to hold the data we get back from the database
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  // useEffect runs automatically when the page loads
  useEffect(() => {
    const fetchApplications = async () => {
      // 1. Grab the saved ID card (token) from the browser
      const token = localStorage.getItem("token");
      
      // 2. If no token is found, kick them out to the login page
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 3. Ask the backend for the data, and attach the token as proof of ID
        const response = await axios.get("http://localhost:5000/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // 4. Save the returned data into our React state
        setApplications(response.data);
      } catch (err) {
        setError("Failed to fetch applications. Your session might have expired.");
      }
    };

    fetchApplications();
  }, [navigate]);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Overview</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {/* Container for the application cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {applications.length === 0 ? (
          <p>No applications tracked yet. Time to start applying!</p>
        ) : (
          applications.map((app) => (
            // The visual "Card" for each application
            <div key={app.id} style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#1a1a2e" }}>{app.title}</h3>
              <p style={{ margin: "5px 0" }}><strong>Organization:</strong> {app.organization}</p>
              <p style={{ margin: "5px 0" }}><strong>Type:</strong> {app.type}</p>
              <p style={{ margin: "5px 0" }}>
                <strong>Status:</strong> 
                <span style={{ marginLeft: "10px", padding: "4px 8px", backgroundColor: "#f1ebd9", borderRadius: "12px", fontSize: "0.9em" }}>
                  {app.status}
                </span>
              </p>
              {app.notes && <p style={{ margin: "10px 0 0 0", fontStyle: "italic", color: "#555" }}>Notes: {app.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;