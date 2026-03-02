import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Avatar,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../redux/feature/auth/authSlice";

const Navbar3 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { professionalUser: user } = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
        handleClose();
    };

    const handleProfile = () => {
        navigate("/professionaldashboard/profile");
        handleClose();
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between py-3 px-4 md:px-8 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer group ml-10 lg:ml-0"
                onClick={() => navigate("/professionaldashboard")}
            >
                <div className="p-1.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <img src="/ServEase.png" alt="ServEase" className="w-8 h-8" />
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                    ServEase
                </h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Notification Bell */}
                <IconButton aria-label="notifications" className="text-gray-600 hover:text-primary transition-colors">
                    <Badge badgeContent={0} color="primary">
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>

                {/* User Avatar & Dropdown */}
                <div className="flex items-center">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
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

                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                mt: 1.5,
                                borderRadius: '16px',
                                minWidth: '180px',
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <div className="px-4 py-3 mb-1">
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {user?.user?.name || "Professional"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.user?.email || ""}
                            </p>
                        </div>
                        <Divider />
                        <MenuItem onClick={handleProfile} className="py-2.5">
                            <ListItemIcon>
                                <PersonOutlineIcon fontSize="small" />
                            </ListItemIcon>
                            My Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout} className="py-2.5 text-red-600">
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" className="text-red-600" />
                            </ListItemIcon>
                            <span className="font-semibold">Logout</span>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </nav>
    );
};

export default Navbar3;
