import type { PaletteMode, ThemeOptions } from "@mui/material";

const serifFontFamily = [
  "Source Serif Pro",
  "PT Serif",
  "serif",
  "ui-serif",
].join(",");

const sansFontFamily = [
  "Source Sans Pro",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(",");

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  typography: {
    button: { fontFamily: sansFontFamily },
    h1: { fontFamily: serifFontFamily },
    h2: { fontFamily: serifFontFamily },
    h3: { fontFamily: serifFontFamily },
    h4: { fontFamily: serifFontFamily },
    h5: { fontFamily: serifFontFamily },
    h6: { fontFamily: sansFontFamily },
    body1: { fontFamily: serifFontFamily },
    body2: { fontFamily: serifFontFamily },
    caption: { fontFamily: serifFontFamily },
    subtitle1: { fontFamily: serifFontFamily },
    subtitle2: { fontFamily: serifFontFamily },
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
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
        }
      : {
          // palette values for dark mode
          primary: {
            main: "#361F0D",
          },
          secondary: {
            main: "#C23211",
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
        }),
  },
});

export type ThemeType = ReturnType<typeof getDesignTokens>;
