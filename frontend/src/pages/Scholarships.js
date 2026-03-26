import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Scholarships = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        
        try {
            const response = await axios.get("https://job-scholarship-tracker.onrender.com/api/applications", {
            headers: { Authorization: `Bearer ${token}` }
            });
            // THE FILTER: Keep items that are Scholarships OR PhD Direct
            // Upgraded Filter AND Sort
            const academicApps = response.data
            .filter(app => app.type && (app.type.trim().toLowerCase() === "scholarship" || app.type.trim().toLowerCase() === "phd direct"))
            .sort((a, b) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            });
            
            setApplications(academicApps);
        } catch (err) {
            setError("Failed to fetch applications.");
        }
        };
        fetchApplications();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this scholarship application?")) {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://job-scholarship-tracker.onrender.com/api/applications/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(applications.filter(app => app.id !== id));
        } catch (err) {
            alert("Failed to delete application.");
        }
        }
    };

    const totalApps = applications.length;
    const interviews = applications.filter(app => app.status === "Interview Scheduled").length;
    const offers = applications.filter(app => app.status === "Offer").length;

    return (
        <div>
        <h2 style={{ marginBottom: "20px" }}>Academic Applications</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
            <div style={{ flex: 1, backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0", fontSize: "2.2em", color: "#1a1a2e" }}>{totalApps}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#555", fontWeight: "bold", fontSize: "0.9em", textTransform: "uppercase", letterSpacing: "1px" }}>Total Apps</p>
            </div>
            <div style={{ flex: 1, backgroundColor: "#fff3cd", padding: "20px", borderRadius: "8px", border: "1px solid #ffeeba", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0", fontSize: "2.2em", color: "#856404" }}>{interviews}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#856404", fontWeight: "bold", fontSize: "0.9em", textTransform: "uppercase", letterSpacing: "1px" }}>Interviews</p>
            </div>
            <div style={{ flex: 1, backgroundColor: "#d4edda", padding: "20px", borderRadius: "8px", border: "1px solid #c3e6cb", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0", fontSize: "2.2em", color: "#155724" }}>{offers}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#155724", fontWeight: "bold", fontSize: "0.9em", textTransform: "uppercase", letterSpacing: "1px" }}>Offers</p>
            </div>
        </div>
            
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {applications.length === 0 ? (
            <p>No academic applications tracked yet. Keep searching!</p>
            ) : (
            applications.map((app) => (
                <div key={app.id} style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ margin: "0", color: "#1a1a2e" }}>{app.title}</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => navigate(`/edit/${app.id}`, { state: { app } })} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#f1ebd9", border: "none", borderRadius: "4px", fontWeight: "bold" }}>Edit</button>
                    <button onClick={() => handleDelete(app.id)} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold" }}>Delete</button>
                    </div>
                </div>

                <p style={{ margin: "5px 0" }}><strong>University/Program:</strong> {app.organization}</p>
                <p style={{ margin: "5px 0" }}><strong>Type:</strong> {app.type}</p>
                <p style={{ margin: "5px 0" }}>
                    <strong>Status:</strong> 
                    <span style={{ marginLeft: "10px", padding: "4px 8px", backgroundColor: "#f1ebd9", borderRadius: "12px", fontSize: "0.9em" }}>
                    {app.status}
                    </span>
                </p>
                
                {app.date_applied && <p style={{ margin: "8px 0", color: "#28a745", fontWeight: "bold" }}>Applied On: {new Date(app.date_applied).toLocaleDateString()}</p>}
                {app.deadline && <p style={{ margin: "8px 0", color: "#d9534f", fontWeight: "bold" }}>Deadline: {new Date(app.deadline).toLocaleDateString()}</p>}                
                {app.link && <p style={{ margin: "8px 0" }}><a href={app.link} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "none", fontWeight: "bold" }}>🔗 View Portal</a></p>}
                
                {app.notes && <p style={{ margin: "10px 0 0 0", fontStyle: "italic", color: "#555" }}>Notes: {app.notes}</p>}
                </div>
            ))
            )}
        </div>
        </div>
    );
};

export default Scholarships;