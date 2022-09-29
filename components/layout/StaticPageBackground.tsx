import React from "react";
import Box from "@mui/material/Box";

// Bodhi Leaf Background
export const StaticPageBackground = () => (
  <Box
    sx={{
      background: "url('assets/icons/bodhi-leaf.svg')",
      height: "90%",
      position: "fixed",
      width: "90%",
      margin: "5%",
      opacity: 0.1,
      zIndex: -1,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      filter: "blur(10px)",
    }}
  />
);
