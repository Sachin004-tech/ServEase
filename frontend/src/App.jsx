import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navbar from "./layouts/Navbar";
import SignUpCustomer from "./pages/register/SignUpCustomer";
import SignUpProfessional from "./pages/register/SignUpProfessional";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";

function App() {

  return <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signupcustomer" element={<SignUpCustomer />} />
      <Route path="/signupprofessional" element={<SignUpProfessional />} />

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
