import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const theme = responsiveFontSizes(
  createTheme({
    typography: {
      h1: {},
    },
    palette: {
      primary: {
        main: "#361F0D",
      },
      secondary: {
        main: "#C23211",
      },
      background: {
        default: "#efe0c2",
        paper: "#ffffff",
      },
      error: {
        main: "#CC0202",
      },
      warning: {
        main: "#FE8027",
      },
      info: {
        main: "#0DC0E8",
      },
      success: {
        main: "#02CC3B",
      },
      divider: "rgba(54,31,13,0.12)",
    },
  })
);

export type ThemeType = typeof theme;
