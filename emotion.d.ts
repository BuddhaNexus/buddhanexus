import "@emotion/react";

import type { ThemeType } from "./pages/theme";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}
