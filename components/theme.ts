import { red } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const theme = responsiveFontSizes(
  createTheme({
    typography: {
      h1: {},
    },
    palette: {
      text: {
        primary: "#361F0D",
      },
      primary: {
        main: "#4caf50",
      },
      secondary: {
        main: red.A200,
      },
    },
  })
);

export type ThemeType = typeof theme;
