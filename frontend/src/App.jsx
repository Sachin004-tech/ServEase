import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./layouts/navbars/Navbar";
import Navbar2 from "./layouts/navbars/Navbar2";
import Navbar3 from "./layouts/navbars/Navbar3";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import allRoutes from "./routes";

function App() {
  const location = useLocation();
  const authPaths = ["/login", "/signupcustomer", "/signupprofessional", "/loginprofessional"];
  const { customerUser, professionalUser } = useSelector((state) => state.auth);

  const isAuthPath = authPaths.includes(location.pathname.toLowerCase());
  const isProfessionalPath = location.pathname.toLowerCase().startsWith("/professionaldashboard");

  return <>
    {isProfessionalPath ? (
      <Navbar3 />
    ) : (
      isAuthPath ? <Navbar2 /> : <Navbar />
    )}
    <Routes>
      {allRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
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
