import React, { memo } from "react";
import useDimensions from "react-cool-dimensions";
import { SourceTextBrowserTree } from "@components/treeView/SourceTextBrowserTree";
import Drawer from "@mui/material/Drawer";
import { isNavigationDrawerOpen } from "features/atoms/layout";
import { useAtom } from "jotai";

// preselect text in the sidebar
// add multilingual icon
// add some missing info that's in the old website
export const SourceTextBrowserDrawer = memo(function SourceTextBrowserDrawer() {
  const { observe, height, width } = useDimensions();

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isNavigationDrawerOpen);

  return (
    <Drawer
      ref={observe}
      anchor="left"
      role="navigation"
      sx={{
        p: 2,
        width: {
          xs: "80vw",
          sm: "60vw",
          md: "40vw",
          lg: "35vw",
          xl: "30vw",
        },
      }}
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <SourceTextBrowserTree parentHeight={height} parentWidth={width} />
    </Drawer>
  );
});
