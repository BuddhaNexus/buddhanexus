import { Box, Typography } from "@mui/material";
import { lighten, styled } from "@mui/material/styles";

export const NodeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  flex: 1,
  height: "100%",
  display: "flex",
  alignItems: "center",
  fontSize: 16,
  ...(isSelected && {
    backgroundColor: theme.palette.background.selected,
    fontWeight: 500,
  }),
  "&:hover": {
    backgroundColor: lighten(theme.palette.background.selected, 0.2),
    fontWeight: 500,
  },
}));

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
