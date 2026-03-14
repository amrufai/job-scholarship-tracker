import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar stays fixed on the left */}
        <Sidebar />

        {/* Main Content changes based on the URL */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<h1>Your Job Applications</h1>} />
            <Route path="/scholarships" element={<h1>Your Scholarship Applications</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;