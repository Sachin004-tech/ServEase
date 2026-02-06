// import React from "react";
// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const AdminHeader = () => {
//      const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("admin_id");
//     navigate("/login");
//   };
//   return (
//     <AppBar position="static">
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography variant="h6">Admin Panel</Typography>
//         <Button color="inherit" onClick={handleLogout}>Logout</Button>
//       </Toolbar>
//     </AppBar>
//   )
// }

// export default AdminHeader









import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_id");
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#1f2937", // Dark header
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Sidebar toggle button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </div>

        {/* Logout Button */}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
