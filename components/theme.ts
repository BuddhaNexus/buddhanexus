import type { PaletteMode, ThemeOptions } from "@mui/material";

export const serifFontFamily = [
  "Source Serif Pro",
  "PT Serif",
  "serif",
  "ui-serif",
].join(",");

export const sansFontFamily = [
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
    body1: { fontFamily: sansFontFamily },
    body2: { fontFamily: sansFontFamily },
    subtitle1: { fontFamily: serifFontFamily },
    subtitle2: { fontFamily: serifFontFamily },
  },
  palette: {
    mode,
    common: {
      pali: "#7C3A00",
      sanskrit: "#2C284C",
      tibetan: "#66160E",
      chinese: "#4F2B56",
    },
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
            main: "#FFBC73",
            contrastText: "#ffffff",
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
          background: {
            paper: "#28170a",
          },
        }),
  },
});

export type ThemeType = ReturnType<typeof getDesignTokens>;
