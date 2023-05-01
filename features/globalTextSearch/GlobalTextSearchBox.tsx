import React, { useState } from "react";
import { Search } from "@mui/icons-material";
import { IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchContainer = styled("div")(({ theme }) => ({
  flexGrow: 1,
  marginLeft: theme.spacing(1),
}));

const StyledPaper = styled("form")(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "4px",
  "&:focus-within": {
    backgroundColor: "white",
  },
}));
const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
}));

const GlobalTextSearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
    // handle search logic here
  };

  return (
    <SearchContainer>
      <StyledPaper>
        <IconButton aria-label="search">
          <Search />
        </IconButton>
        <SearchInput
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
        />
      </StyledPaper>
    </SearchContainer>
  );
};

export default GlobalTextSearchBox;
