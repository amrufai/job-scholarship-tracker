import axios from "axios";

const baseURL = (
  process.env.REACT_APP_API_URL || "https://job-scholarship-tracker.onrender.com"
).replace(/\/$/, "");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
