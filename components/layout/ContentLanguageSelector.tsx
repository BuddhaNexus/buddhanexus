import type { FC } from "react";
import React from "react";
import { Link } from "@components/common/Link";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  title: string;
  href: string;
  color: string;
}

export const ContentLanguageSelector: FC<Props> = ({ title, href, color }) => {
  const materialTheme = useTheme();

  return (
    <Link
      href={href}
      sx={{
        display: "flex",
        my: 2,
        mx: 2,
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        [materialTheme.breakpoints.down("sm")]: {
          justifyContent: "flex-start",
          flexDirection: "row",
        },
        "&:hover": { opacity: 0.8 },
        "&:active": { opacity: 1 },
      }}
    >
      <Box
        component="img"
        src="/assets/icons/bn_tree.svg"
        sx={{
          height: 120,
          width: 120,
          p: 2,
          borderRadius: 2,
          background: color,
          filter: "drop-shadow(0px 2px 1px rgba(0,0,0,0.25))",
        }}
        alt={`select language: ${title}`}
      />
      <Typography variant="h6" sx={{ mx: 2, mt: 1 }}>
        {title}
      </Typography>
    </Link>
  );
};
