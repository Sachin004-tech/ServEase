import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
     const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_id");
    navigate("/login");
  };
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Admin Panel</Typography>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
