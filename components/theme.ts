import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import type { PaletteMode, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";
import { SourceLanguage } from "utils/constants";

export const sourceSerif = Source_Serif_4({ subsets: ["latin", "latin-ext"] });
export const sourceSans = Source_Sans_3({ subsets: ["latin", "latin-ext"] });

declare module "@mui/material/styles" {
  interface TypeBackground {
    header: string;
    accent: string;
    card: string;
    inverted: string;
  }
  interface TypeText {
    inverted: string;
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
  main: { chn: "#270431", pli: "#371f00", skt: "#0F0B2B", tib: "#260b08" },
  accent: {
    chn: "#f0c8d1",
    pli: "#f5e5d1",
    skt: "#d0cde0",
    tib: "#f0cdd1",
  },
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
              : "#393732",
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
              : "#393732",
            card: grey[100],
            inverted: grey[800],
          },
          text: {
            primary: grey[900],
            secondary: grey[600],
            inverted: grey[50],
          },
          divider: "rgba(54,31,13,0.12)",
        }
      : {
          // palette values for dark mode
          primary: {
            main: sourceLanguage
              ? SOURCE_LANG_DARK_COLORS.accent[sourceLanguage]
              : "#E1BD97",
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
            default: "#201c22",
            paper: "#09070b",
            accent: grey[900],
            header: sourceLanguage
              ? SOURCE_LANG_DARK_COLORS.main[sourceLanguage]
              : "#0F0405",
            card: "#2c2c2f",
          },
          text: {
            primary: "#d2cfcf",
            secondary: "#a8a5a5",
            inverted: grey[900],
          },
          divider: "rgba(54,31,13,0.12)",
        }),
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          minWidth: 0,
          "@media (min-width: 0px)": {
            fontSize: "1.1rem",
          },
        },
      },
    },
  },
});

export type ThemeType = ReturnType<typeof getDesignTokens>;
