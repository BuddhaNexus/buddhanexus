import type { FC } from "react";
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme as useMaterialTheme } from "@mui/material/styles";

interface Props {
  title: string;
  href: string;
  color: string;
}

export const ContentLanguageSelector: FC<Props> = ({ title, color }) => {
  const materialTheme = useMaterialTheme();

  return (
    <Box sx={{}}>
      <Box
        component="img"
        src="/assets/icons/bn_tree.svg"
        sx={{
          flex: 1,
          background: color,
          [materialTheme.breakpoints.down("sm")]: {},
        }}
        alt="logo"
      />
      <Box>
        <Typography>{title}</Typography>
      </Box>
    </Box>
  );
};
