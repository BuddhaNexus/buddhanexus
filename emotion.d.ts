import "@emotion/react";

import type { ThemeType } from "./utils/theme";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}
