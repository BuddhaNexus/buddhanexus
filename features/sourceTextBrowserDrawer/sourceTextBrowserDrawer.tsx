import { memo } from "react";
import { SourceTextBrowserTree } from "@components/db/SourceTextBrowserTree";
import Drawer from "@mui/material/Drawer";

export const SourceTextBrowserDrawer = memo(function SourceTextBrowserDrawer() {
  return (
    <Drawer anchor="left" role="navigation" open>
      <SourceTextBrowserTree />
    </Drawer>
  );
});
