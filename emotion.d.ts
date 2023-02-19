/* eslint-disable @typescript-eslint/no-import-type-side-effects */
import "@emotion/react";

import type { ThemeType } from "@components/theme";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}
