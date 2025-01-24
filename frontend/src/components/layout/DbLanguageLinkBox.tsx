import type { FC } from "react";
import React from "react";
import Image from "next/image";
import { Link } from "@components/common/Link";
import { Box, Typography } from "@mui/material";
import treeIcon from "@public/assets/logos/bn_tree_only.svg";

interface Props {
  title: string;
  href: string;
  color: string;
}

export const DbLanguageLinkBox: FC<Props> = ({ title, href, color }) => {
  return (
    <Link
      href={href}
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: "0 0 auto",
        width: {
          xs: "calc(50% - 0.5rem)",
          md: "160px",
        },
        justifyContent: "center",
        alignItems: "center",
        "&:hover": { opacity: 0.9 },
        "&:active": { opacity: 1 },
      }}
      data-testid="db-language-tile"
    >
      <Box
        component={Image}
        src={treeIcon}
        priority={false}
        sx={{
          height: { xs: 100, sm: 130, md: 120 },
          width: { xs: 100, sm: 130, md: 120 },
          p: 2,
          borderRadius: 2,
          background: color,
          filter: "drop-shadow(0px 2px 1px rgba(0,0,0,0.25))",
        }}
        alt={`select language: ${title}`}
      />
      <Typography component="h2" variant="h6" sx={{ mx: 2, mt: 1 }}>
        {title}
      </Typography>
    </Link>
  );
};
