import React from "react";
import Image from "next/image";
import { Link } from "@components/common/Link";
import { Box, useTheme } from "@mui/material";
import treeTextIcon from "@public/assets/logos/bn_text_only.svg";
import treeIcon from "@public/assets/logos/bn_tree_only.svg";

interface LogoLinkProps {
  showText?: boolean;
}

export const LogoLink = ({ showText = true }: LogoLinkProps) => {
  const materialTheme = useTheme();

  return (
    <Link
      color="inherit"
      sx={{
        display: "inline-flex",
        alignItems: "center",
      }}
      href="/"
      underline="none"
      noWrap
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          [materialTheme.breakpoints.up("sm")]: {
            pr: 1,
          },
        }}
      >
        <Box
          component={Image}
          src={treeIcon}
          priority={true}
          sx={{
            width: "auto",
            height: "auto",
            maxHeight: 48,
            minWidth: 48,
            [materialTheme.breakpoints.down("sm")]: {
              maxHeight: 36,
            },
          }}
          alt="logo"
        />
        {showText && (
          <Box
            component={Image}
            src={treeTextIcon}
            priority={false}
            width={144}
            sx={{
              pl: 2,
              height: "auto",
              [materialTheme.breakpoints.down("sm")]: {
                display: "none",
              },
            }}
            alt="BuddhaNexus"
          />
        )}
      </Box>
    </Link>
  );
};
