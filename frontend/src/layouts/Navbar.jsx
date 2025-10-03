import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between py-4 px-6 border-b border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <img
          src="/ServEase.png" 
          alt="Household Services"
          className="w-10 h-10"
        />
        <h1 onClick={()=>navigate("/")} className="text-xl font-bold text-primary">ServEase</h1>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
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
        {/* Search Icon */}
        <span className="absolute left-3 text-gray-400">
          <img className="h-5 w-5" src="./search_icon.png" alt="" />
        </span>
        <input
          type="text"
          placeholder="Search for services (Plumber, Cleaning, Electrician...)"
          className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button onClick={()=> navigate("/login")}
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
            Login
        </button>
        <button className="hidden md:block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition">
          Book Now
        </button>

        {/* Mobile Menu Icon */}
        <button className="md:hidden">
          <img
            src="/menu.svg" // your mobile menu icon
            alt="Menu"
            className="w-7 h-7"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
