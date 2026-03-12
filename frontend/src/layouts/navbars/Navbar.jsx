import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/feature/auth/authSlice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "../../components/modal/Modal";
import RoleSelection from "../../components/RoleSelection";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalMode, setModalMode] = useState("signup");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { customerUser: user } = useSelector((state) => state.auth);
  const cartQuantity = useSelector((state) => state.cart?.quantity || 0);

  const openRoleModal = (mode) => {
    setModalMode(mode);
    setShowRoleModal(true);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
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

        {/* Desktop: Search & Location */}
        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-3xl mx-8">
          <div className="flex items-center gap-2 flex-[0.35] bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
            <LocationOnIcon className="text-black h-5 w-5" />
            <input
              type="text"
              placeholder="Select Location..."
              className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none placeholder:text-black"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
            <SearchIcon className="text-black h-5 w-5" />
            <input
              type="text"
              placeholder="Search for services (Plumber, Salon...)"
              className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none placeholder:text-black"
            />
          </div>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ul className="flex items-center gap-6 font-semibold text-gray-600">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
              }
            >
              About us
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
              }
            >
              Services
            </NavLink>
            <NotificationsIcon
              className="text-gray-700 hover:text-primary transition-colors cursor-pointer"
              onClick={() => navigate("/notifications")}
            />
          </ul>

          <IconButton
            aria-label="cart"
            onClick={() => navigate("/cart?cart&category=mens_grooming&draftOrderId=69a0254a77bc5a002676f65c")}
          >
            <Badge badgeContent={cartQuantity} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <button
            onClick={() => navigate("/customer-bookings")}
            className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2.5 rounded-full transition shadow-md hover:shadow-lg active:scale-95 text-sm"
          >
            My Bookings
          </button>

          {!user ? (
            <button
              onClick={() => openRoleModal("login")}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-full transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
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

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-200 mb-1">
                    <p className="flex items-center text-sm font-bold text-gray-900">
                      <span className="text-gray-500 w-12">Name:</span>
                      <span className="truncate">{user?.user?.name || "User"}</span>
                    </p>
                    <p className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="text-gray-500 w-9">Email:</span>
                      <span className="truncate font-bold">{user?.user?.email || ""}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => { navigate("/help"); setDropdownOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HelpOutlineIcon fontSize="small" className="text-gray-400" />
                    <span>Help Center</span>
                  </button>
                  <button
                    onClick={() => { navigate("/customer-bookings"); setDropdownOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <EventNoteIcon fontSize="small" className="text-gray-400" />
                    <span>My Booking</span>
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ExitToAppIcon fontSize="small" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Right: Cart + Hamburger */}
        <div className="flex lg:hidden items-center gap-1">
          <IconButton
            aria-label="cart"
            onClick={() => navigate("/cart?cart&category=mens_grooming&draftOrderId=69a0254a77bc5a002676f65c")}
          >
            <Badge badgeContent={cartQuantity} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={() => setMobileMenuOpen(true)} aria-label="open menu">
            <MenuIcon />
          </IconButton>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navTo("/")}
              >
                <div className="p-1.5 bg-primary/10 rounded-xl">
                  <img src="/ServEase.png" alt="ServEase" className="w-7 h-7" />
                </div>
                <span className="text-lg font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ServEase
                </span>
              </div>
              <IconButton onClick={() => setMobileMenuOpen(false)} aria-label="close menu">
                <CloseIcon />
              </IconButton>
            </div>

            {/* Search (mobile) */}
            <div className="px-5 py-4 space-y-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
                <LocationOnIcon className="text-gray-400" fontSize="small" />
                <input
                  type="text"
                  placeholder="Select Location..."
                  className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
                <SearchIcon className="text-gray-400" fontSize="small" />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full bg-transparent border-none text-sm font-medium text-black focus:outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              {[
                { label: "Home", path: "/" },
                { label: "Services", path: "/services" },
                { label: "Notifications", path: "/notifications" },
                { label: "My Bookings", path: "/customer-bookings" },
                { label: "Help Center", path: "/help" },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => navTo(path)}
                  className="w-full text-left px-4 py-3 rounded-2xl text-gray-700 font-semibold hover:bg-primary/5 hover:text-primary transition-colors text-sm"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Auth Section */}
            <div className="px-5 py-5 border-t border-gray-100 space-y-3">
              {!user ? (
                <>
                  <button
                    onClick={() => openRoleModal("login")}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl text-sm transition active:scale-95"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openRoleModal("signup")}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl text-sm transition active:scale-95"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-1">
                    <Avatar
                      src={user?.user?.profilePic || ""}
                      alt={user?.user?.name || "User"}
                      sx={{ width: 44, height: 44, bgcolor: "primary.main" }}
                    >
                      {user?.user?.name?.charAt(0) || "U"}
                    </Avatar>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{user?.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{user?.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 flex items-center justify-center gap-2 text-red-600 font-bold border border-red-100 rounded-2xl hover:bg-red-50 transition text-sm"
                  >
                    <ExitToAppIcon fontSize="small" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
