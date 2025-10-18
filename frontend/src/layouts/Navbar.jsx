// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setTheme } from "../redux/feature/theme/themeSlice";
// import { NavLink, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const currentTheme = useSelector((state) => state.theme.currentTheme);
//   const navigate = useNavigate();

//    const toggleTheme = () => {
//     const newTheme = currentTheme === "light" ? "dark" : "light";
//     dispatch(setTheme(newTheme));
//   };

//   return (
//     <nav className="flex items-center justify-between py-4 px-6 border-b border-gray-200 shadow-sm">
//       {/* Logo */}
//       <div className="flex items-center gap-2 cursor-pointer">
//         <img
//           src="/ServEase.png"
//           alt="Household Services"
//           className="w-10 h-10"
//         />
//         <h1 onClick={()=>navigate("/")} className="text-xl font-bold text-primary">ServEase</h1>
//       </div>

//       {/* Desktop Menu */}
//       <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
//         <NavLink to="/">
//           <li className="hover:text-primary transition">Beauty</li>
//         </NavLink>
//         <NavLink to="/services">
//           <li className="hover:text-primary transition">Services</li>
//         </NavLink>
//         <NavLink to="/about">
//           <li className="hover:text-primary transition">About Us</li>
//         </NavLink>
//         <NavLink to="/contact">
//           <li className="hover:text-primary transition">Contact</li>
//         </NavLink>
//       </ul>

//       {/* Search Box */}
//       <div className="hidden md:flex items-center w-1/3 relative">
//         {/* Search Icon */}
//         <span className="absolute left-3 text-gray-400">
//           <img className="h-5 w-5" src="./search_icon.png" alt="" />
//         </span>
//         <input
//           type="text"
//           placeholder="Search for services (Plumber, Cleaning, Electrician...)"
//           className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-4">
//         <button onClick={()=> navigate("/login")}
//           type="button"
//           className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//         >
//             Login
//         </button>
//         <button className="hidden md:block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition">
//           Book Now
//         </button>

//          {/* Single Theme Toggle Button */}
//         <button
//           onClick={toggleTheme}
//           className="px-4 py-1 rounded-full text-sm bg-gray-200 text-gray-700 border border-gray-300 hover:opacity-80 transition"
//         >
//           {currentTheme === "light" ? "Dark" : "Light"}
//         </button>

//         {/* Mobile Menu Icon */}
//         <button className="md:hidden">
//           <img
//             src="/menu.svg" // your mobile menu icon
//             alt="Menu"
//             className="w-7 h-7"
//           />
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/feature/theme/themeSlice";
import { NavLink, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Moon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Sun

const Navbar = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  };

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <img src="/ServEase.png" alt="ServEase" className="w-10 h-10" />
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold hover:text-primary/80 transition"
  style={{ color: "#fff" }}
        >
          ServEase
        </h1>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700 dark:text-gray-200">
        <NavLink to="/">
          <li className="hover:text-primary transition">Beauty</li>
        </NavLink>
        <NavLink to="/services">
          <li className="hover:text-primary transition">Services</li>
        </NavLink>
        <NavLink to="/about">
          <li className="hover:text-primary transition">About Us</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="hover:text-primary transition">Contact</li>
        </NavLink>
      </ul>

      {/* Search Box */}
      <div className="hidden md:flex items-center w-1/3 relative">
        <span className="absolute left-3 text-gray-400">
          <img className="h-5 w-5" src="./search_icon.png" alt="Search" />
        </span>
        <input
          type="text"
          placeholder="Search for services (Plumber, Cleaning...)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 transition shadow-md"
        >
          Login
        </button>

        {/* Book Now */}
        <button className="hidden md:block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition shadow-md">
          Book Now
        </button>

        {/* Single Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:opacity-80 transition shadow-sm"
        >
          {currentTheme === "light" ? (
            <Brightness4Icon className="w-5 h-5" />
          ) : (
            <Brightness7Icon className="w-5 h-5" />
          )}
          {currentTheme === "light" ? "Dark" : "Light"}
        </button>

        {/* Mobile Menu Icon */}
        <button className="md:hidden">
          <img src="/menu.svg" alt="Menu" className="w-7 h-7" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
