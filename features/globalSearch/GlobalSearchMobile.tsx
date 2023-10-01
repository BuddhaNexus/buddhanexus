import React, { useRef } from "react";
import {
  type InputKeyDown,
  useGlobalSearch,
} from "@components/hooks/useGlobalSearch";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";

import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "./GlobalSearchStyledMuiComponents";

const GlobalSearchMobile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleOnSearch } = useGlobalSearch();

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isEmpty = inputRef.current?.value === "";

  return (
    <Container
      maxWidth="md"
      sx={{
        display: {
          lg: "none",
        },
        // This component is outside <main>, so mt & px values are given here to match padding in components/layout/PageContainer.tsx
        mt: 4,
        px: { xs: 4, sm: 2 },
      }}
    >
      <Box position="relative">
        <SearchBoxWrapper>
          <SearchBoxInput
            inputRef={inputRef}
            // TODO: i18n
            placeholder="Search..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <IconButton
                  onClick={() => handleOnSearch(inputRef.current?.value ?? "")}
                >
                  <SearchIcon fontSize="inherit" />
                </IconButton>
              ),
              endAdornment: !isEmpty && (
                <IconButton onClick={handleClear}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              ),
            }}
            fullWidth
            onKeyDown={(e: InputKeyDown) =>
              handleOnSearch(inputRef.current?.value ?? "", e)
            }
          />
        </SearchBoxWrapper>
      </Box>
    </Container>
  );
};

export default GlobalSearchMobile;
