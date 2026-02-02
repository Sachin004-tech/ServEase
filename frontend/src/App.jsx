import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Navbar from "./layouts/Navbar";
import SignUpCustomer from "./pages/SignUpCustomer";
import SignUpProfessional from "./pages/SignUpProfessional";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

function App() {

  return <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signupcustomer" element={<SignUpCustomer />} />
      <Route path="/signupprofessional" element={<SignUpProfessional />} />

      {/* admin Routes */}
      <Route path="/admin/admindashboard" element={<AdminDashboard />} />

    </Routes>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </>
}

export default App;
