import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import SearchIcon from "@mui/icons-material/Search";
import type { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

interface SearchBoxWrapperProps extends BoxProps {
  isOpen: boolean;
}

const SearchBoxWrapper = styled("form")<SearchBoxWrapperProps>(
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

const SearchBoxInput = styled(TextField)({
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

const GlobalTextSearchDesktop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");

  const handleSearchIconClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (isOpen) {
      setSearchText("");
    }
    setIsOpen((open) => !open);
  };

  const handleSearch = () => {
    // TODO
    return searchText;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Box
      position="relative"
      sx={{
        display: {
          xs: "none",
          lg: "flex",
        },
        flexGrow: 1,
        marginRight: 3,
      }}
    >
      <IconButton color="inherit" onClick={handleSearchIconClick}>
        {isOpen ? (
          <CloseIcon sx={{ fontSize: 28 }} />
        ) : (
          <SearchIcon sx={{ fontSize: 28 }} />
        )}
      </IconButton>

      <SearchBoxWrapper isOpen={isOpen}>
        <SearchBoxInput
          inputRef={inputRef}
          // TODO: i18n
          placeholder="Search..."
          variant="outlined"
          value={searchText}
          InputProps={
            isOpen
              ? {
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <KeyboardReturnIcon />
                    </IconButton>
                  ),
                }
              : {}
          }
          fullWidth
          onChange={handleChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </SearchBoxWrapper>
    </Box>
  );
};

export default GlobalTextSearchDesktop;
