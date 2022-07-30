import "styled-components";
import { theme } from "./pages/theme";

declare module "styled-components" {
  export type DefaultTheme = typeof theme;
}
