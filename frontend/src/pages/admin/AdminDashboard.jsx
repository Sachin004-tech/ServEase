// import React, { useState } from "react";
// import AdminHeader from "../../layouts/AdminHeader";
// import AdminSidebar from "../../layouts/AdminSidebar";
// import StatsCard from "../../components/StatsCard";
// import { Box, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const navigate = useNavigate();

//   return (
//     <Box sx={{ display: "flex" }}>
//       <AdminSidebar open={sidebarOpen} onNavigate={navigate} />
//       <Box sx={{ flex: 1 }}>
//         <AdminHeader/>
//         <Grid container spacing={2} sx={{ p: 2 }}>
//           <StatsCard title="Total Users" value={1245} />
//           <StatsCard title="Total Bookings" value={342} />
//           <StatsCard title="Revenue" value="₹58,200" />
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default AdminDashboard;








// import React, { useState } from "react";
// import AdminHeader from "../../layouts/AdminHeader";
// import AdminSidebar from "../../layouts/AdminSidebar";
// import StatsCard from "../../components/StatsCard";
// import { Box, Grid, Paper, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// // Charts
// import BookingBarChart from "../../components/charts/BookingBarChart";
// import ServicePieChart from "../../components/charts/ServicePieChart";

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const navigate = useNavigate();

//   return (
//     <Box sx={{ display: "flex" }}>
    
//     {/* FIXED SIDEBAR */}
//     <AdminSidebar open={sidebarOpen} onNavigate={navigate} />

//     {/* MAIN CONTENT */}
//     <Box 
//       component="main"
//       sx={{ 
//         flexGrow: 1, 
//         bgcolor: "background.default",
//         minHeight: "100vh",
//         ml: "240px" // Same width as sidebar
//       }}
//     >
//       <AdminHeader />

//       {/* STATS CARDS */}
//       <Grid container spacing={2} sx={{ p: 2 }}>
//         <StatsCard title="Total Users" value={1245} />
//         <StatsCard title="Total Bookings" value={342} />
//         <StatsCard title="Revenue" value="₹58,200" />
//       </Grid>

//       {/* CHARTS */}
//       <Grid container spacing={2} sx={{ p: 2 }}>
//         <Grid item xs={12} md={7}>
//           <Paper sx={{ p: 2, height: 370 }}>
//             <Typography variant="h6" mb={2}>Monthly Bookings</Typography>
//             <BookingBarChart />
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={5}>
//           <Paper sx={{ p: 2, height: 370 }}>
//             <Typography variant="h6" mb={2}>Service Distribution</Typography>
//             <ServicePieChart />
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   </Box>
//   );
// };

// export default AdminDashboard;











import React, { useState } from "react";
import AdminHeader from "../../layouts/AdminHeader";
import AdminSidebar from "../../layouts/AdminSidebar";
import StatsCard from "../../components/StatsCard";
import { Box, Grid, Paper, Typography, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Charts
import BookingBarChart from "../../components/charts/BookingBarChart";
import ServicePieChart from "../../components/charts/ServicePieChart";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      
      {/* SIDEBAR */}
      <AdminSidebar open={sidebarOpen} onNavigate={navigate} />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100vh",
          ml: sidebarOpen ? "240px" : "70px",
          transition: "0.3s",
        }}
      >
        {/* HEADER with toggle */}
        <AdminHeader onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Toolbar spacer for fixed header */}
        <Toolbar />

        {/* STATS CARDS */}
        <Grid container spacing={2} sx={{ p: 2 }}>
          <StatsCard title="Total Users" value={1245} />
          <StatsCard title="Total Bookings" value={342} />
          <StatsCard title="Revenue" value="₹58,200" />
        </Grid>

        {/* CHARTS */}
        <Grid container spacing={2} sx={{ p: 2 }}>
          {/* Bar Chart */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2, height: 370 }}>
              <Typography variant="h6" mb={2}>
                Monthly Bookings
              </Typography>
              <BookingBarChart />
            </Paper>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, height: 370 }}>
              <Typography variant="h6" mb={2}>
                Service Distribution
              </Typography>
              <ServicePieChart />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
