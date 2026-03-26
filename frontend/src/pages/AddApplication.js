import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddApplication = () => {
    const [title, setTitle] = useState("");
    const [organization, setOrganization] = useState("");
    const [type, setType] = useState("Job"); // Default value
    const [status, setStatus] = useState("Wishlist"); // Default value
    const [deadline, setDeadline] = useState("");
    // Get today's date formatted as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const [dateApplied, setDateApplied] = useState(today);
    const [link, setLink] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
        navigate("/login");
        return;
        }

        try {
        await axios.post(
            "https://job-scholarship-tracker.onrender.com/api/applications",
            { title, organization, type, status, date_applied: dateApplied, deadline, link, notes },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Send you straight back to the Dashboard to see your new entry!
        navigate("/");
        } catch (err) {
        setError(err.response?.data?.message || "Failed to save application.");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Add New Opportunity</h2>
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", gap: "15px" }}>
            <input type="text" placeholder="Role / Program Title (e.g., Software Engineer)" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="text" placeholder="Organization / University" value={organization} onChange={(e) => setOrganization(e.target.value)} required style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
                <option value="Job">Job</option>
                <option value="Scholarship">Scholarship</option>
                <option value="PhD Direct">PhD Direct</option>
            </select>
            
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "0.85em", fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Date Applied (Optional)</label>
                    <input type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", color: dateApplied ? "#000" : "#757575" }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "0.85em", fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Application Deadline</label>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", color: deadline ? "#000" : "#757575" }} />
                </div>
            </div>
            
            <input type="url" placeholder="Link to Portal / Posting" value={link} onChange={(e) => setLink(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            
            <textarea placeholder="Notes (e.g., Requires 2 recommendation letters, ICEEA2025 paper uploaded...)" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", resize: "vertical" }}></textarea>

            <button type="submit" style={{ padding: "12px", backgroundColor: "#1a1a2e", color: "white", borderRadius: "5px", cursor: "pointer", border: "none", fontWeight: "bold", marginTop: "10px" }}>
            Save Application
            </button>
        </form>
        </div>
    );
};

export default AddApplication;