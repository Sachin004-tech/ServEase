import React, { useState } from "react";
import AdminHeader from "../../layouts/AdminHeader";
import AdminSidebar from "../../layouts/AdminSidebar";
import StatsCard from "../../components/StatsCard";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar open={sidebarOpen} onNavigate={navigate} />
      <Box sx={{ flex: 1 }}>
        <AdminHeader/>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <StatsCard title="Total Users" value={1245} />
          <StatsCard title="Total Bookings" value={342} />
          <StatsCard title="Revenue" value="₹58,200" />
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
