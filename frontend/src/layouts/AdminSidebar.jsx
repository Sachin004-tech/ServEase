import React from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

const AdminSidebar = ({ open, onClose, onNavigate }) => {
  return (
    <Drawer variant="persistent" open={open}>
    <List>
      <ListItem button onClick={() => onNavigate("/admin/dashboard")}>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={() => onNavigate("/admin/users")}>
        <ListItemIcon><PeopleIcon /></ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
      <ListItem button onClick={() => onNavigate("/admin/bookings")}>
        <ListItemIcon><BookOnlineIcon /></ListItemIcon>
        <ListItemText primary="Bookings" />
      </ListItem>
    </List>
  </Drawer>
  )
}

export default AdminSidebar
