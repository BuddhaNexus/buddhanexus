// eslint-disable-next-line no-restricted-imports,@typescript-eslint/no-unused-vars
import type React from "react";

declare module "@mui/material/styles/createPalette" {
  export interface CommonColors {
    pali: string;
    sanskrit: string;
    tibetan: string;
    chinese: string;
  }
}

declare module "@mui/material/styles" {
  interface TypeBackground {
    header: string;
    accent: string;
    card: string;
    selected: string;
    inverted: string;
  }
  interface TypeText {
    inverted: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }
}
