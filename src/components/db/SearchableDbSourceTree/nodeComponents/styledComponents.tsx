import { Box, Link, Typography } from "@mui/material";
import { styled } from "@mui/system";

export const NodeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  flex: 1,
  height: "100%",
  display: "flex",
  alignItems: "center",
  fontSize: 16,
  ...(isSelected && {
    backgroundColor: theme.palette.background.default,
    fontWeight: 500,
  }),
  "&:hover": {
    backgroundColor: theme.palette.background.card,
    fontWeight: 500,
  },
}));

export const TextNodeLink = styled(Link)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  paddingTop: "0.75rem",
  fontSize: "inherit",
  textDecoration: "none",
});

export const RowBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

export const TextNameTypography = styled(Typography)({
  overflow: "clip",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "inherit",
});

export const NodeLabelsBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  width: "100%",
});
