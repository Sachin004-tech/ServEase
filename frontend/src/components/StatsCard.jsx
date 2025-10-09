import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const StatsCard = ({ title, value, icon, color = "primary.main" }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5">{value}</Typography>
      </Box>
      {icon && (
        <Box
          sx={{
            fontSize: 40,
            color: color,
          }}
        >
          {icon}
        </Box>
      )}
    </Paper>
  );
};

export default StatsCard;
