import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Layout from "./pages/Layut";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota para Login */}
        <Route path="/" element={<LoginPage />} />

        <Route element={<Layout/>}>
            {/* Rota para Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Rota para upload */}
            <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
