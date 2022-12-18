import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useSourceLanguage } from "@components/hooks/useSourceLanguage";
import { getDesignTokens } from "@components/theme";
import type {} from "@mui/lab/themeAugmentation";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

export const MUIThemeProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const { sourceLanguage } = useSourceLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const MUITheme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme(
          getDesignTokens({
            mode: isMounted ? (theme === "light" ? "light" : "dark") : "light",
            sourceLanguage,
          })
        )
      ),
    [isMounted, sourceLanguage, theme]
  );

  return (
    <ThemeProvider key={theme} theme={MUITheme}>
      {children}
    </ThemeProvider>
  );
};
