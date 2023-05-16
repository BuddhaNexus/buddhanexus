import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const SearchBoxWrapper = styled("form")(({ theme }) => ({
  position: "absolute",
  top: "-0",
  left: "0",
  right: "0",
  bottom: "0",
  borderRadius: theme.shape.borderRadius,
  border: `${theme.palette.primary.main} 1px solid`,
}));

const SearchBoxInput = styled(TextField)({
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

const GlobalTextSearchMobile = () => {
  const [searchText, setSearchText] = useState("");

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
        my: 2,
        width: "100%",
        height: "48px",
      }}
    >
      <SearchBoxWrapper>
        <SearchBoxInput
          placeholder="Search..."
          variant="outlined"
          value={searchText}
          InputProps={{
            startAdornment: (
              <IconButton onClick={handleSearch}>
                <SearchIcon fontSize="inherit" />
              </IconButton>
            ),
            endAdornment: (
              <IconButton onClick={() => setSearchText("")}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            ),
          }}
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

export default GlobalTextSearchMobile;
