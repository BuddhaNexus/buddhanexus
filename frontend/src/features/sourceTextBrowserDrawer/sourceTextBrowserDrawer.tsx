import React, { memo } from "react";
import useDimensions from "react-cool-dimensions";
import { isDbSourceBrowserDrawerOpenAtom } from "@atoms";
import {
  DbSourceTreeType,
  SearchableDbSourceTree,
} from "@components/db/SearchableDbSourceTree";
import { Drawer as MuiDrawer } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAtom } from "jotai";

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  // zIndex linked to components/layout/AppTopBar.tsx
  zIndex: `${theme.zIndex.drawer + 2}`,
  width: "80vw",
  [theme.breakpoints.up("sm")]: {
    width: "60vw",
  },
  [theme.breakpoints.up("md")]: {
    width: "50vw",
  },
}));

export const DbSourceBrowserDrawer = memo(function DbSourceBrowserDrawer() {
  const { observe, height, width } = useDimensions();

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(
    isDbSourceBrowserDrawerOpenAtom,
  );

  return (
    <Drawer
      ref={observe}
      anchor="left"
      role="navigation"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <SearchableDbSourceTree
        type={DbSourceTreeType.BROWSER}
        parentHeight={height}
        parentWidth={width}
      />
    </Drawer>
  );
});
