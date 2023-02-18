import React, { memo } from "react";
import useDimensions from "react-cool-dimensions";
import { SourceTextBrowserTree } from "@components/treeView/SourceTextBrowserTree";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";

export const SourceTextBrowserDrawer = memo(function SourceTextBrowserDrawer() {
  const { observe, height } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      // Triggered whenever the size of the target is changed...

      // To stop observing the current target element
      unobserve();
      // To re-start observing the current target element
      observe();
    },
  });

  return (
    <Drawer ref={observe} anchor="left" role="navigation" open>
      <Box sx={{ px: 2 }}>
        <SourceTextBrowserTree height={height} />
      </Box>
    </Drawer>
  );
});
