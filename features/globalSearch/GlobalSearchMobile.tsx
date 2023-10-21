import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
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
  const { t } = useTranslation("settings");
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
      maxWidth="xl"
      sx={{
        display: {
          lg: "none",
        },
        w: 1,
        // This component is outside <main>, so mt & px values are given here to match padding in components/layout/PageContainer.tsx
        mt: 4,
        px: { xs: 4, sm: 2 },
      }}
    >
      <Box position="relative">
        <SearchBoxWrapper>
          <SearchBoxInput
            inputRef={inputRef}
            placeholder={t("search.placeholder")}
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
