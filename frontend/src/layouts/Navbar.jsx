import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { Badge, IconButton } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  // Assuming cart is in redux or local state. For now, we'll placeholder it or use local state if not in redux.
  // Looking at HomePage.jsx, it seems to be local state there. 
  // If we want it to persist across pages, it should be in Redux.
  // For now, I'll just keep it at 0 or try to select it from store if it exists.
  const cart = useSelector((state) => state.cart?.items || []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between py-3 px-4 md:px-8 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="p-1.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
          <img src="/ServEase.png" alt="ServEase" className="w-8 h-8" />
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
          ServEase
        </h1>
      </div>

      {/* Separate Search & Location (Desktop) */}
      <div className="hidden lg:flex items-center gap-4 flex-1 max-w-3xl mx-8">
        {/* Location Input */}
        <div className="flex items-center gap-2 flex-[0.35] bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
          <LocationOnIcon className="text-black h-5 w-5" />
          <input
            type="text"
            placeholder="Select Location..."
            className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none placeholder:text-black"
          />
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
          <SearchIcon className="text-black h-5 w-5" />
          <input
            type="text"
            placeholder="Search for services (Plumber, Salon...)"
            className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none placeholder:text-black"
          />
        </div>
      </div>

      {/* Desktop Menu & Right Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Desktop NavLinks */}
        <ul className="hidden xl:flex items-center gap-6 font-semibold text-gray-600">
          <NavLink
            to="/"
            className={({ isActive }) => `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}
          >
            About us
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) => `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}
          >
            Services
          </NavLink>
        </ul>

        <div className="flex items-center gap-1 md:gap-3">
          {/* Cart */}
          <IconButton
            aria-label="cart"
            className="text-gray-700 hover:text-primary transition-colors"
            onClick={() => navigate("/cart")}
          >
            <Badge badgeContent={cart.length} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-full transition shadow-md hover:shadow-lg active:scale-95"
          >
            Login
          </button>

          {/* Book Now */}
          <button className="hidden md:block bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-full transition shadow-md hover:shadow-lg active:scale-95">
            Book Now
          </button>

          {/* Mobile Menu Icon */}
          <IconButton className="xl:hidden p-2 text-gray-700">
            <MenuIcon />
          </IconButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

