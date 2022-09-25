import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { getDesignTokens } from "@components/theme";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

export const MUIThemeProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const MUITheme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme(
          getDesignTokens(
            isMounted ? (theme === "light" ? "light" : "dark") : "light"
          )
        )
      ),
    [isMounted, theme]
  );

  return (
    <ThemeProvider key={theme} theme={MUITheme}>
      {children}
    </ThemeProvider>
  );
};
