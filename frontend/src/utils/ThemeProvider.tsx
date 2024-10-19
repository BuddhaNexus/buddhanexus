import type { PropsWithChildren } from "react";
import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";
import { getDesignTokens } from "@components/theme";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { dbLanguage } = useNullableDbRouterParams();

  const MUITheme = responsiveFontSizes(
    extendTheme(getDesignTokens({ dbLanguage })),
  );

  // @ts-expect-error type issue with responsiveFontSizes not being ready for the experimental CSSVars API, but it works file.
  return <CssVarsProvider theme={MUITheme}>{children}</CssVarsProvider>;
};
