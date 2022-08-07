import "@emotion/react";

import type { ThemeType } from "@components/theme";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}
