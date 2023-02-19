import React, { memo } from "react";
import useDimensions from "react-cool-dimensions";
import { SourceTextBrowserTree } from "@components/treeView/SourceTextBrowserTree";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { isNavigationDrawerOpen } from "features/atoms/layout";
import { useAtom } from "jotai";

// preselect text in the sidebar
// add multilingual icon
// add top bar button and sync the state in jotai
// style this
// add some missing info that's in the old website
export const SourceTextBrowserDrawer = memo(function SourceTextBrowserDrawer() {
  const { observe, height } = useDimensions();

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isNavigationDrawerOpen);

  return (
    <Drawer
      ref={observe}
      anchor="left"
      role="navigation"
      sx={{ p: 2 }}
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <Box>
        <SourceTextBrowserTree parentHeight={height} />
      </Box>
    </Drawer>
  );
});
