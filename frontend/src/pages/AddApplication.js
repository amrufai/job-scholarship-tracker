import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../api/client";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
        navigate("/login");
        return;
        }

        setError("");
        setIsSubmitting(true);

        try {
        await api.post(
            "/api/applications",
            { title, organization, type, status, date_applied: dateApplied, deadline, link, notes },
            { headers: authHeaders(token) }
        );
        
        // Send you straight back to the Dashboard to see your new entry!
        navigate("/");
        } catch (err) {
        setError(err.response?.data?.message || "Failed to save application.");
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 720, margin: "12px auto" }}>
        <div className="card">
        <h2 style={{ marginBottom: 12 }}>Add New Opportunity</h2>
        {error && <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
            <input className="input" type="text" placeholder="Role / Program Title (e.g., Software Engineer)" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1 }} />
            <input className="input" type="text" placeholder="Organization / University" value={organization} onChange={(e) => setOrganization(e.target.value)} required style={{ flex: 1 }} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input" style={{ flex: 1 }}>
                <option value="Job">Job</option>
                <option value="Scholarship">Scholarship</option>
                <option value="PhD Direct">PhD Direct</option>
            </select>
            
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input" style={{ flex: 1 }}>
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "0.85em", fontWeight: "600", marginBottom: 6, color: "var(--muted)" }}>Date Applied (Optional)</label>
                    <input className="input" type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} style={{ color: dateApplied ? "inherit" : "#757575" }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "0.85em", fontWeight: "600", marginBottom: 6, color: "var(--muted)" }}>Application Deadline</label>
                    <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ color: deadline ? "inherit" : "#757575" }} />
                </div>
            </div>
            
            <input className="input" type="url" placeholder="Link to Portal / Posting" value={link} onChange={(e) => setLink(e.target.value)} />
            
            <textarea className="input" placeholder="Notes (e.g., Requires 2 recommendation letters, ICEEA2025 paper uploaded...)" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ resize: "vertical" }}></textarea>

            <button type="submit" disabled={isSubmitting} className="btn-accent" style={{ marginTop: 6 }}>{isSubmitting ? "Saving..." : "Save Application"}</button>
        </form>
        </div>
        </div>
    );
};

export default AddApplication;
