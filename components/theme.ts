import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import type { PaletteMode, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";
import { SourceLanguage } from "utils/constants";

export const sourceSerif = Source_Serif_4();
export const sourceSans = Source_Sans_3();

declare module "@mui/material/styles" {
  interface TypeBackground {
    header: string;
    accent: string;
    card: string;
  }
}

interface DesignTokenParams {
  mode: PaletteMode;
  // some theme elements depend on the source language selected
  sourceLanguage: SourceLanguage;
}

const SOURCE_LANG_LIGHT_COLORS = {
  chn: "#4F2B56",
  pli: "#7C3A00",
  skt: "#2C284C",
  tib: "#66160E",
};

const SOURCE_LANG_DARK_COLORS = {
  chn: "#180022",
  pli: "#110b03",
  skt: "#0f0e1a",
  tib: "#170604",
};

export const getDesignTokens = ({
  mode,
  sourceLanguage,
}: DesignTokenParams): ThemeOptions => ({
  typography: {
    button: { fontFamily: sourceSans.style.fontFamily },
    h1: { fontFamily: sourceSerif.style.fontFamily, fontSize: "5rem" },
    h2: { fontFamily: sourceSerif.style.fontFamily, fontSize: "2.5rem" },
    h3: { fontFamily: sourceSerif.style.fontFamily, fontSize: "1.75rem" },
    h4: { fontFamily: sourceSerif.style.fontFamily, fontSize: "1.5rem" },
    h5: { fontFamily: sourceSerif.style.fontFamily, fontSize: "1.25rem" },
    h6: { fontFamily: sourceSans.style.fontFamily, fontSize: "1.15rem" },
    body1: {
      fontFamily: sourceSans.style.fontFamily,
      fontSize: "1.15rem",
      lineHeight: 1.65,
    },
    body2: { fontFamily: sourceSans.style.fontFamily },
    subtitle1: { fontFamily: sourceSerif.style.fontFamily },
    subtitle2: { fontFamily: sourceSerif.style.fontFamily },
  },
  palette: {
    mode,
    common: {
      pali: SOURCE_LANG_LIGHT_COLORS[SourceLanguage.PALI],
      sanskrit: SOURCE_LANG_LIGHT_COLORS[SourceLanguage.SANSKRIT],
      tibetan: SOURCE_LANG_LIGHT_COLORS[SourceLanguage.TIBETAN],
      chinese: SOURCE_LANG_LIGHT_COLORS[SourceLanguage.CHINESE],
    },
    ...(mode === "light"
      ? {
          primary: {
            main: sourceLanguage
              ? SOURCE_LANG_LIGHT_COLORS[sourceLanguage]
              : "#361F0D",
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
            default: "#efe0c2",
            paper: "#ffffff",
            accent: grey[50],
            header: sourceLanguage
              ? SOURCE_LANG_LIGHT_COLORS[sourceLanguage]
              : "#361F0D",
            card: grey[100],
          },
          text: {
            primary: grey[900],
            secondary: grey[600],
          },
          divider: "rgba(54,31,13,0.12)",
        }
      : {
          // palette values for dark mode
          primary: {
            main: "#FFBC73",
            contrastText: "#fff",
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
            default: "#080609",
            paper: "#060305",
            accent: grey[900],
            header: sourceLanguage
              ? SOURCE_LANG_DARK_COLORS[sourceLanguage]
              : "#0F0405",
            card: "#121213",
          },
          text: {
            primary: "#d2cfcf",
            secondary: "#a8a5a5",
          },
          divider: "rgba(54,31,13,0.12)",
        }),
  },
});

export type ThemeType = ReturnType<typeof getDesignTokens>;
