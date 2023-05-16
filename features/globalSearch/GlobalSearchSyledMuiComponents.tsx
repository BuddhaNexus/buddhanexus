import type { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

interface SearchBoxWrapperProps extends BoxProps {
  isOpen: boolean;
}

export const DesktopSearchBoxWrapper = styled("form")<SearchBoxWrapperProps>(
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

export const DesktopSearchBoxInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    padding: "0px",
    transition: "all 0.3s ease-in-out",
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
  "& .MuiInputBase-input": {
    transition: "all 0.3s ease-in-out",
    "&:focus": {
      width: "100%",
    },
  },
});

export const MobileSearchBoxWrapper = styled("form")(({ theme }) => ({
  position: "absolute",
  top: "-0",
  left: "0",
  right: "0",
  bottom: "0",
  borderRadius: theme.shape.borderRadius,
  border: `${theme.palette.primary.main} 1px solid`,
}));

export const MobileSearchBoxInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    padding: "4px 0 0 0",
    transition: "all 0.3s ease-in-out",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
      padding: "0px",
    },
  },
  "& .MuiInputBase-input": {
    transition: "all 0.3s ease-in-out",
    padding: "0",
    "&:focus": {
      width: "100%",
    },
  },
});
