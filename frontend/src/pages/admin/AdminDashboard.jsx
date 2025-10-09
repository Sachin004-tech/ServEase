// import React from "react";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("admin_id");
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-5 flex flex-col justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-blue-600 mb-8 text-center">
//             Admin Panel
//           </h2>
//           <nav className="flex flex-col space-y-4">
//             {/* <button
//               className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
//               onClick={() => navigate("/admin/dashboard")}
//             > 
//             </button>
//             <button
//               className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
//               onClick={() => navigate("/admin/users")}
//             >
//             </button>
//             <button
//               className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
//               onClick={() => navigate("/admin/bookings")}
//             >
//             </button>
//           </nav>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 text-red-600 hover:text-red-800"
//         >
//         </button> */}

//             <button
//               className="flex items-center gap-3 border-1 text-gray-700 hover:text-blue-600"
//             //   onClick={() => navigate("/admin/dashboard")}
//             >
//               Dashboard
//             </button>

//             <button
//               className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
//             //   onClick={() => navigate("/admin/users")}
//             >
//               Manage Users
//             </button>
//           </nav>
//         </div>

//         <button
//           className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
//         //   onClick={() => navigate("/admin/bookings")}
//         >
//           Manage Bookings
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-semibold text-gray-800">
//             Welcome, Admin 👋
//           </h1>
//           <p className="text-gray-600">
//             {new Date().toLocaleDateString("en-GB")}
//           </p>
//         </header>

//         {/* Stats Cards */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-semibold">Total Users</h2>
//             <p className="text-gray-600 text-lg mt-2">1,245</p>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-semibold">Total Bookings</h2>
//             <p className="text-gray-600 text-lg mt-2">342</p>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-semibold">Revenue</h2>
//             <p className="text-gray-600 text-lg mt-2">₹58,200</p>
//           </div>
//         </section>

//         {/* Upcoming Section Placeholder */}
//         <section className="mt-10 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
//           <p className="text-gray-600">
//             You can show recent bookings, user signups, or system alerts here.
//           </p>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;










import React, { useState } from "react";
import AdminHeader from "../../layouts/AdminHeader";
import AdminSidebar from "../../layouts/AdminSidebar";
import StatsCard from "../../components/StatsCard";
// import DashboardCharts from "../components/DashboardCharts";
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
        {/* <DashboardCharts /> */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
