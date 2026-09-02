import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, authHeaders } from "../api/client";

const EditApplication = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appData = location.state?.app;

    const [title, setTitle] = useState(appData?.title || "");
    const [organization, setOrganization] = useState(appData?.organization || "");
    const [type, setType] = useState(appData?.type || "Job");
    const [status, setStatus] = useState(appData?.status || "Wishlist");

    const defaultDateApplied = appData?.date_applied ? new Date(appData.date_applied).toISOString().split('T')[0] : "";
    const [dateApplied, setDateApplied] = useState(defaultDateApplied);

    const defaultDate = appData?.deadline ? new Date(appData.deadline).toISOString().split('T')[0] : "";
    const [deadline, setDeadline] = useState(defaultDate);

    const [link, setLink] = useState(appData?.link || "");
    const [notes, setNotes] = useState(appData?.notes || "");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!appData) {
            navigate("/", { replace: true });
        }
    }, [appData, navigate]);

    if (!appData) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        setError("");
        setIsSubmitting(true);

        try {
        await api.put(
            `/api/applications/${appData.id}`,
            { title, organization, type, status, date_applied: dateApplied, deadline, link, notes },
            { headers: authHeaders(token) }
        );

        navigate("/");
        } catch (err) {
        setError(err.response?.data?.message || "Failed to update application.");
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 720, margin: "12px auto" }}>
        <div className="card">
        <h2 style={{ marginBottom: 12 }}>Edit Opportunity</h2>
        {error && <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            <div style={{ display: "flex", gap: 12 }}>
            <input className="input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1 }} />
            <input className="input" type="text" placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} required style={{ flex: 1 }} />
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
                <input className="input" type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.85em", fontWeight: "600", marginBottom: 6, color: "var(--muted)" }}>Application Deadline</label>
                <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            </div>

            <input className="input" type="url" placeholder="Link to Portal / Posting" value={link} onChange={(e) => setLink(e.target.value)} />
            <textarea className="input" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" style={{ resize: "vertical" }}></textarea>

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="submit" disabled={isSubmitting} className="btn-accent" style={{ flex: 1 }}>{isSubmitting ? "Saving..." : "Save Changes"}</button>
            <button type="button" onClick={() => navigate("/")} disabled={isSubmitting} className="input" style={{ flex: 1, textAlign: "center" }}>Cancel</button>
            </div>
        </form>
        </div>
        </div>
    );
};

export default EditApplication;
