import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddApplication from "./pages/AddApplication";
import EditApplication from "./pages/EditApplication";
import Jobs from "./pages/Jobs";
import Scholarships from "./pages/Scholarships";

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
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-application" element={<AddApplication />} />
            <Route path="/edit/:id" element={<EditApplication />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;