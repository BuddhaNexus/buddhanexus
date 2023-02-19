import React, { memo } from "react";
import useDimensions from "react-cool-dimensions";
import { SourceTextBrowserTree } from "@components/treeView/SourceTextBrowserTree";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";

// preselect text in the sidebar
// add multilingual icon
// add top bar button and sync the state in jotai
export const SourceTextBrowserDrawer = memo(function SourceTextBrowserDrawer() {
  const { observe, height } = useDimensions();

  return (
    <Drawer ref={observe} anchor="left" role="navigation" open>
      <Box sx={{ px: 2 }}>
        <SourceTextBrowserTree parentHeight={height} />
      </Box>
    </Drawer>
  );
});
