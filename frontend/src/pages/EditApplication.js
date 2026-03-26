import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditApplication = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appData = location.state?.app;

    const [title, setTitle] = useState(appData?.title || "");
    const [organization, setOrganization] = useState(appData?.organization || "");
    const [type, setType] = useState(appData?.type || "Job");
    const [status, setStatus] = useState(appData?.status || "Wishlist");
    
    // NEW: Format the Date Applied properly
    const defaultDateApplied = appData?.date_applied ? new Date(appData.date_applied).toISOString().split('T')[0] : "";
    const [dateApplied, setDateApplied] = useState(defaultDateApplied);

    // Format the Deadline properly
    const defaultDate = appData?.deadline ? new Date(appData.deadline).toISOString().split('T')[0] : "";
    const [deadline, setDeadline] = useState(defaultDate);
    
    const [link, setLink] = useState(appData?.link || "");
    const [notes, setNotes] = useState(appData?.notes || "");
    const [error, setError] = useState("");

    if (!appData) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
        await axios.put(
            `http://localhost:5000/api/applications/${appData.id}`,
            // NEW: Make sure date_applied is included in the payload!
            { title, organization, type, status, date_applied: dateApplied, deadline, link, notes },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        navigate("/");
        } catch (err) {
        setError(err.response?.data?.message || "Failed to update application.");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Edit Opportunity</h2>
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", gap: "15px" }}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="text" placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} required style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
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

            {/* NEW: Side-by-side date pickers for Edit Page */}
            <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.85em", fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Date Applied (Optional)</label>
                <input type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.85em", fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Application Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            </div>
            </div>

            <input type="url" placeholder="Link to Portal / Posting" value={link} onChange={(e) => setLink(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", resize: "vertical" }}></textarea>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" style={{ flex: 1, padding: "12px", backgroundColor: "#1a1a2e", color: "white", borderRadius: "5px", cursor: "pointer", border: "none", fontWeight: "bold" }}>
                Save Changes
            </button>
            <button type="button" onClick={() => navigate("/")} style={{ flex: 1, padding: "12px", backgroundColor: "#ccc", color: "#333", borderRadius: "5px", cursor: "pointer", border: "none", fontWeight: "bold" }}>
                Cancel
            </button>
            </div>
        </form>
        </div>
    );
};

export default EditApplication;