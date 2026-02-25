import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { Badge, IconButton, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/feature/auth/authSlice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Modal from "../../components/modal/Modal";
import RoleSelection from "../../components/RoleSelection";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalMode, setModalMode] = useState("signup"); // "signup" or "login"
  const { customerUser: user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart?.items || []);

  const openRoleModal = (mode) => {
    setModalMode(mode);
    setShowRoleModal(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-center py-3 px-4 md:px-8 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
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
              className={({ isActive }) =>
                `hover:text-primary transition-colors ${isActive ? "text-primary" : ""
                }`
              }
            >
              About us
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `hover:text-primary transition-colors ${isActive ? "text-primary" : ""
                }`
              }
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

            {/* Book Now */}
            <button className="hidden md:block bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-full transition shadow-md hover:shadow-lg active:scale-95">
              Book Now
            </button>

            {/* User Profile / Login */}
            {!user ? (
              <button
                onClick={() => openRoleModal("login")}
                className="hidden sm:block px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-full transition shadow-md hover:shadow-lg active:scale-95 hover:cursor-pointer"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <IconButton
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-1 border-2 border-transparent hover:border-primary transition-all"
                >
                  <Avatar
                    src={user?.user?.profilePic || ""}
                    alt={user?.user?.name || "User"}
                    sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                  >
                    {user?.user?.name?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 mb-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {user?.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.user?.email || ""}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/help");
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <HelpOutlineIcon fontSize="small" className="text-gray-400" />
                      <span>Help Center</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/my-bookings");
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <EventNoteIcon fontSize="small" className="text-gray-400" />
                      <span>My Booking</span>
                    </button>

                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <ExitToAppIcon fontSize="small" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Select Your Role"
        size="md"
      >
        <RoleSelection onClose={() => setShowRoleModal(false)} mode={modalMode} />
      </Modal>
    </>
  );
};

export default Navbar;

