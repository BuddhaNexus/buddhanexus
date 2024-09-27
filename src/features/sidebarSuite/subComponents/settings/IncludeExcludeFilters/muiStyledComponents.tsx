import {
  autocompleteClasses,
  Box,
  type BoxProps,
  Popper,
  Typography,
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

interface ListItemLabelWapper {
  maxLines: number;
  children: React.ReactNode;
}
export const ListItemLabelWapper = styled("div")<ListItemLabelWapper>(
  ({ maxLines }) => ({
    // "-webkit-box" used to handle line-clamping (atm plain css clamp doesn't work)
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: maxLines,
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
);

export const ListItemLabel = styled(Typography)({
  display: "inline",
  whiteSpace: "normal",
  wordBreak: "break-all",
});
