import React, { memo } from "react";
import useDimensions from "react-cool-dimensions";
import { SourceTextBrowserTree } from "@components/treeView/SourceTextBrowserTree";
import { Drawer as MuiDrawer } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isNavigationDrawerOpen } from "features/atoms/layout";
import { useAtom } from "jotai";

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  // zIndex linked to components/layout/AppTopBar.tsx
  zIndex: `${theme.zIndex.drawer + 2}`,
  width: "80vw",
  [theme.breakpoints.up("sm")]: {
    width: "60vw",
  },
  [theme.breakpoints.up("md")]: {
    width: "40vw",
  },
  [theme.breakpoints.up("lg")]: {
    width: "35vw",
  },
  [theme.breakpoints.up("xl")]: {
    width: "30vw",
  },
  padding: 2,
}));

// TODO: preselect currently viewed text in the sidebar
export const SourceTextBrowserDrawer = memo(function SourceTextBrowserDrawer() {
  const { observe, height, width } = useDimensions();

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isNavigationDrawerOpen);

  return (
    <Drawer
      ref={observe}
      anchor="left"
      role="navigation"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <SourceTextBrowserTree parentHeight={height} parentWidth={width} />
    </Drawer>
  );
});
