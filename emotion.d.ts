import "@emotion/react";

import { ThemeType } from "./pages/theme";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}
