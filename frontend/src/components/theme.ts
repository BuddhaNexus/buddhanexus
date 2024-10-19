import { Noto_Serif, Source_Sans_3 } from "next/font/google";
import { grey } from "@mui/material/colors";
// eslint-disable-next-line no-restricted-imports
import type { CssVarsThemeOptions } from "@mui/material/styles/experimental_extendTheme";
import { DbLanguage } from "@utils/api/types";

export const sourceSerif = Noto_Serif({ subsets: ["latin", "latin-ext"] });
export const sourceSans = Source_Sans_3({ subsets: ["latin", "latin-ext"] });

interface DesignTokenParams {
  // some theme elements depend on the source language selected
  dbLanguage?: DbLanguage;
}

const DB_LANGUAGE_COLORS_LIGHT: Record<DbLanguage, string> = {
  zh: "#4F2B56",
  pa: "#7C3A00",
  sa: "#2C284C",
  bo: "#66160E",
};

const DB_LANGUAGE_COLORS_DARK = {
  main: { zh: "#270431", pa: "#371f00", sa: "#0F0B2B", bo: "#260b08" },
  accent: {
    zh: "#f0c8d1",
    pa: "#f5e5d1",
    sa: "#d0cde0",
    bo: "#f0cdd1",
  },
};

const commonPaletteColors = {
  pali: DB_LANGUAGE_COLORS_LIGHT.pa,
  sanskrit: DB_LANGUAGE_COLORS_LIGHT.sa,
  tibetan: DB_LANGUAGE_COLORS_LIGHT.bo,
  chinese: DB_LANGUAGE_COLORS_LIGHT.zh,
};

export const getDesignTokens = ({
  dbLanguage,
}: DesignTokenParams): CssVarsThemeOptions => ({
  colorSchemes: {
    light: {
      palette: {
        common: commonPaletteColors,
        primary: {
          main: dbLanguage ? DB_LANGUAGE_COLORS_LIGHT[dbLanguage] : "#29262d",
        },
        secondary: {
          main: "#C23211",
        },
        error: {
          main: "#972222",
        },
        warning: {
          main: "#FE8027",
        },
        info: {
          main: "#0DC0E8",
        },
        success: {
          main: "#10A60B",
        },
        background: {
          default: "#efe0c2",
          paper: "#ffffff",
          header: dbLanguage ? DB_LANGUAGE_COLORS_LIGHT[dbLanguage] : "#29262d",
          accent: grey[50],
          card: grey[100],
          selected: grey[300],
          inverted: grey[800],
        },
        text: {
          primary: grey[900],
          secondary: grey[700],
          inverted: grey[50],
        },
        divider: "rgba(54,31,13,0.12)",
      },
    },
    dark: {
      // palette values for dark mode
      palette: {
        common: commonPaletteColors,
        primary: {
          main: dbLanguage
            ? DB_LANGUAGE_COLORS_DARK.accent[dbLanguage]
            : "#E1BD97",
          contrastText: "#fff",
        },
        secondary: {
          main: "#C23211",
        },
        error: {
          main: "#972222",
        },
        warning: {
          main: "#FE8027",
        },
        info: {
          main: "#0DC0E8",
        },
        success: {
          main: "#10A60B",
        },
        background: {
          default: "#201c22",
          paper: "#29262d",
          header: dbLanguage
            ? DB_LANGUAGE_COLORS_DARK.main[dbLanguage]
            : "#29262d",
          accent: grey[900],
          card: "#29262d",
          selected: "#262329",
          inverted: grey[100],
        },
        text: {
          primary: grey[100],
          secondary: grey[300],
          inverted: grey[900],
        },
        divider: "rgba(54,31,13,0.12)",
      },
    },
  },

  typography: {
    button: { fontFamily: sourceSans.style.fontFamily },
    h1: {
      fontFamily: sourceSerif.style.fontFamily,
      fontSize: "4.5rem",
    },
    h2: { fontFamily: sourceSerif.style.fontFamily, fontSize: "2.5rem" },
    h3: { fontFamily: sourceSerif.style.fontFamily, fontSize: "1.75rem" },
    h4: { fontFamily: sourceSerif.style.fontFamily, fontSize: "1.5rem" },
    h5: { fontFamily: sourceSerif.style.fontFamily, fontSize: "1.3rem" },
    h6: { fontFamily: sourceSans.style.fontFamily, fontSize: "1.25rem" },
    body1: {
      fontSize: "1.15rem",
      lineHeight: 1.65,
      fontFamily: sourceSans.style.fontFamily,
    },
    body2: { fontFamily: sourceSans.style.fontFamily },
    body3: { fontFamily: sourceSans.style.fontFamily },
    subtitle1: { fontFamily: sourceSerif.style.fontFamily },
    subtitle2: { fontFamily: sourceSerif.style.fontFamily },
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "body3" },
          style: {
            fontSize: "1.1rem",
          },
        },
      ],
    },
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
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.palette.mode === "dark"
            ? {
                color: "white",
              }
            : {
                color: theme.palette.grey[900],
              }),
        }),
      },
    },
  },
});

export type ThemeType = ReturnType<typeof getDesignTokens>;
