import React from "react";
import { Routes,Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Navbar from "./layouts/Navbar";
import SignUp from "./pages/SignUp";


function App() {
  return <>
    <Navbar/>
   <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUp />} />
   
   </Routes>
  </>
}

export default App;
