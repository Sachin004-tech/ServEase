import { createTheme } from "@mui/material/styles";

export const themes = {
  light: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#6366F1" },
      secondary: { main: "#EC4899" },
      background: { default: "#f9fafb" },
    },
  }),
  dark: createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#6366F1" },
      secondary: { main: "#EC4899" },
      background: { default: "#1f2937" },
    },
  }),
};
