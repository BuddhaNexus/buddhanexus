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

  return <CssVarsProvider theme={MUITheme}>{children}</CssVarsProvider>;
};
