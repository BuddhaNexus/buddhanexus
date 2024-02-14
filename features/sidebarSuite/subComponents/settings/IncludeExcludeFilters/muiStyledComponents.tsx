import {
  autocompleteClasses,
  Box,
  type BoxProps,
  Popper,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

interface RowProps extends BoxProps {
  inheretedstyles: React.CSSProperties;
}
export const RowItem = styled(Box)<RowProps>(({ inheretedstyles }) => ({
  ...inheretedstyles,
  display: "flex",
  justifyContent: "space-between",
  flex: 1,
  "&:nth-of-type(even)": {
    bgcolor: "background.accent",
  },
  "&:hover": { textDecoration: "underline" },
}));

export const ListLabelWapper = styled("div")({
  // "-webkit-box" used to handle line-clamping
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const ListLabel = styled(Typography)({
  display: "inline",
  whiteSpace: "normal",
  wordBreak: "break-all",
});

export const ListLabelId = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));
