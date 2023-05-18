import type { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

interface SearchBoxWrapperProps extends BoxProps {
  isOpen: boolean;
}

export const AppTopBarSearchBoxWrapper = styled("form")<SearchBoxWrapperProps>(
  ({ theme, isOpen }) => ({
    position: "absolute",
    top: "-4px",
    left: "48px",
    right: "0",
    bottom: "-4px",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[100],
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
    transform: `scaleX(${isOpen ? 1 : 0})`,
    transformOrigin: "left",
    opacity: `${isOpen ? 1 : 0}`,
    transition: `${
      isOpen
        ? "transform 200ms, opacity 100ms"
        : "transform 200ms, opacity 500ms"
    }`,
    overflow: "hidden",
  })
);

export const SearchBoxWrapper = styled("form")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `${theme.palette.primary.main} 1px solid`,
}));

export const SearchBoxInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    padding: "0px",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
});
