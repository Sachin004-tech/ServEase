// import React from "react";
// import { Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import BookOnlineIcon from "@mui/icons-material/BookOnline";

// const AdminSidebar = ({ open, onClose, onNavigate }) => {
//   return (
//     <Drawer variant="persistent" open={open}>
//     <List>
//       <ListItem button onClick={() => onNavigate("/admin/dashboard")}>
//         <ListItemIcon><DashboardIcon /></ListItemIcon>
//         <ListItemText primary="Dashboard" />
//       </ListItem>
//       <ListItem button onClick={() => onNavigate("/admin/users")}>
//         <ListItemIcon><PeopleIcon /></ListItemIcon>
//         <ListItemText primary="Users" />
//       </ListItem>
//       <ListItem button onClick={() => onNavigate("/admin/bookings")}>
//         <ListItemIcon><BookOnlineIcon /></ListItemIcon>
//         <ListItemText primary="Bookings" />
//       </ListItem>
//     </List>
//   </Drawer>
//   )
// }

// export default AdminSidebar










import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Box,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

const AdminSidebar = ({ open, onNavigate }) => {
  const drawerWidth = open ? 240 : 70;

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Bookings", icon: <BookOnlineIcon />, path: "/admin/bookings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          transition: "0.3s",
          backgroundColor: "#111827",
          color: "#fff",
          borderRight: "1px solid #1f2937",
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <Tooltip
              key={item.text}
              title={!open ? item.text : ""}
              placement="right"
            >
              <ListItemButton
                onClick={() => onNavigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  "&:hover": { backgroundColor: "#1f2937" },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
