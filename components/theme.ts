import type { PaletteMode, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Source_Sans_3, Source_Serif_4 } from "@next/font/google";

export const sourceSerif = Source_Serif_4();
export const sourceSans = Source_Sans_3();

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  typography: {
    button: { fontFamily: sourceSans.style.fontFamily },
    h1: { fontFamily: sourceSerif.style.fontFamily },
    h2: { fontFamily: sourceSerif.style.fontFamily, fontWeight: 400 },
    h3: { fontFamily: sourceSerif.style.fontFamily },
    h4: { fontFamily: sourceSerif.style.fontFamily },
    h5: { fontFamily: sourceSerif.style.fontFamily },
    h6: { fontFamily: sourceSans.style.fontFamily },
    body1: { fontFamily: sourceSans.style.fontFamily },
    body2: { fontFamily: sourceSans.style.fontFamily },
    subtitle1: { fontFamily: sourceSerif.style.fontFamily },
    subtitle2: { fontFamily: sourceSerif.style.fontFamily },
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
            // @ts-expect-error: TODO: fix type issue with adding custom colors to palette
            accent: grey[50],
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
            accent: grey[900],
          },
        }),
  },
});

export type ThemeType = ReturnType<typeof getDesignTokens>;
