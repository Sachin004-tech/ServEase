import React from "react";
import { Routes,Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Navbar from "./layouts/Navbar";
import SignUpCustomer from "./pages/SignUpCustomer";
import SignUpProfessional from "./pages/SignUpProfessional";


function App() {
  return <>
    <Navbar/>
   <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signupcustomer" element={<SignUpCustomer />} />
    <Route path="/signupprofessional" element={<SignUpProfessional />} />
   
   </Routes>
  </>
}

export default App;
