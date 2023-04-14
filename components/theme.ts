import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import type { PaletteMode, ThemeOptions } from "@mui/material";
import { common, grey } from "@mui/material/colors";
import { SourceLanguage } from "utils/constants";

export const sourceSerif = Source_Serif_4();
export const sourceSans = Source_Sans_3();

interface DesignTokenParams {
  mode: PaletteMode;
  // some theme elements depend on the source language selected
  sourceLanguage: SourceLanguage;
}

const SOURCE_LANGUAGE_COLORS = {
  [SourceLanguage.CHINESE]: "#4F2B56",
  [SourceLanguage.PALI]: "#7C3A00",
  [SourceLanguage.SANSKRIT]: "#2C284C",
  [SourceLanguage.TIBETAN]: "#66160E",
};

export const getDesignTokens = ({
  mode,
  sourceLanguage,
}: DesignTokenParams): ThemeOptions => ({
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
      pali: SOURCE_LANGUAGE_COLORS[SourceLanguage.PALI],
      sanskrit: SOURCE_LANGUAGE_COLORS[SourceLanguage.SANSKRIT],
      tibetan: SOURCE_LANGUAGE_COLORS[SourceLanguage.TIBETAN],
      chinese: SOURCE_LANGUAGE_COLORS[SourceLanguage.CHINESE],
    },
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            main: sourceLanguage
              ? SOURCE_LANGUAGE_COLORS[sourceLanguage]
              : "#361F0D",
          },
          secondary: {
            main: "#C23211",
          },
          background: {
            default: "#efe0c2",
            paper: "#ffffff",
            // @ts-expect-error: TODO: fix type issue with adding custom colors to palette
            accent: grey[50],
            header: grey[100],
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
            paper: common.black,
            accent: grey[900],
            header: common.black,
          },
        }),
  },
});

export type ThemeType = ReturnType<typeof getDesignTokens>;
