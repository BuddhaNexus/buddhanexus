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
  animation: string;
}

const SearchBoxWrapper = styled("form")<SearchBoxWrapperProps>(
  ({ theme, animation }) => ({
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
    animation: `${animation} 0.3s ease-in-out forwards`,
    width: "0%",
    "@keyframes growFromLeftToRight": {
      "0%": {
        width: "0%",
        padding: "0px",
      },
      "100%": {
        width: "calc(100% - 42px)",
        padding: "0px 15px",
      },
    },
    "@keyframes shrinkFromRightToLeft": {
      "0%": {
        width: "calc(100% - 42px)",
        padding: "0px 15px",
      },
      "100%": {
        width: "0%",
        padding: "0px",
      },
    },
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
  const [animation, setAnimation] = useState("none");
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAnimation("growFromLeftToRight");
      inputRef.current?.focus();
    } else if (!isOpen && animation !== "none") {
      setAnimation("shrinkFromRightToLeft");
      setSearchText("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSearchIconlick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsOpen((open) => !open);
  };

  const handleSearch = () => {
    // TODO
    return searchText;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <Box
      position="relative"
      sx={{
        display: {
          xs: "none",
          lg: "flex",
        },
        width: `calc(100% - 288px)`,
      }}
    >
      <IconButton color="inherit" onClick={handleSearchIconlick}>
        {isOpen ? (
          <CloseIcon sx={{ fontSize: 28 }} />
        ) : (
          <SearchIcon sx={{ fontSize: 28 }} />
        )}
      </IconButton>
      <SearchBoxWrapper animation={animation}>
        <SearchBoxInput
          inputRef={inputRef}
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
