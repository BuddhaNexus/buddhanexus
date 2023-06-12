import React, { useRef } from "react";
import {
  type InputKeyDown,
  useGlobalSearch,
} from "@components/hooks/useGlobalSearch";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "./GlobalSearchStyledMuiComponents";

const GlobalSearchMobile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleOnSearchPress, handleOnSearchClick } = useGlobalSearch();

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Box
      position="relative"
      sx={{
        display: {
          lg: "none",
        },
        // This component is outside of <main>, so mt & px values are given here to match padding in components/layout/PageContainer.tsx
        mt: { xs: 2, sm: 4 },
        mb: 2,
        px: 2,
        width: "100%",
        height: "48px",
      }}
    >
      <SearchBoxWrapper>
        <SearchBoxInput
          inputRef={inputRef}
          // TODO: i18n
          placeholder="Search..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <IconButton
                onClick={() =>
                  handleOnSearchClick(inputRef.current?.value ?? "")
                }
              >
                <SearchIcon fontSize="inherit" />
              </IconButton>
            ),
            endAdornment: (
              <IconButton onClick={handleClear}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            ),
          }}
          fullWidth
          onKeyDown={(e: InputKeyDown) =>
            handleOnSearchPress(e, inputRef.current?.value ?? "")
          }
        />
      </SearchBoxWrapper>
    </Box>
  );
};

export default GlobalSearchMobile;
