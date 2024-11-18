import { Box, styled } from "@mui/material";

export const InputOutlineBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[400]}`,
  minHeight: "4rem",
  padding: theme.spacing(1),
}));

export const MultiSelectionBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

export const SelectionChipsBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isExpanded",
})<{ isExpanded: boolean }>(({ theme, isExpanded }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  maxHeight: isExpanded ? "none" : "6.9rem", // 3 rows
  overflow: "clip",
}));

export const SelectionHeadBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
