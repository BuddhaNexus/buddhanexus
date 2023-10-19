import type { Breakpoint } from "@mui/system";
import { isSettingsOpenAtom } from "features/atoms";
import { useAtom } from "jotai";

export const SETTINGS_DRAWER_WIDTH = 360;
export const OPEN_SETTINGS_CALC = `calc(100% - ${SETTINGS_DRAWER_WIDTH}px)`;

type ResponsiveDirection = {
  [key in Breakpoint]?: "column" | "row";
};

export const useSettingsDrawer = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useAtom(isSettingsOpenAtom);

  const parallelStackDirection: ResponsiveDirection = isSettingsOpen
    ? { xs: "column", lg: "row" }
    : { xs: "column", md: "row" };

  const parallelArrowTransform = isSettingsOpen
    ? { lg: "rotate(-90deg)" }
    : { md: "rotate(-90deg)" };

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    drawerWidth: SETTINGS_DRAWER_WIDTH,
    isOpenMainWidth: OPEN_SETTINGS_CALC,
    parallelStackDirection,
    parallelArrowTransform,
  };
};
