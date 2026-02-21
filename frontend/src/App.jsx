import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./layouts/navbars/Navbar";
import Navbar2 from "./layouts/navbars/Navbar2";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import allRoutes from "./routes";

function App() {
  const location = useLocation();
  const authPaths = ["/login", "/signupcustomer", "/signupprofessional", "/loginprofessional"];
  const { user } = useSelector((state) => state.auth);

  return <>
    {authPaths.includes(location.pathname.toLowerCase()) ? <Navbar2 /> : <Navbar />}
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
