import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  type InputKeyDown,
  useGlobalSearch,
} from "@components/hooks/useGlobalSearch";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import {
  AppTopBarSearchBoxWrapper,
  SearchBoxInput,
} from "./GlobalSearchStyledMuiComponents";

const GlobalSearchDesktop = () => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { handleSearchAction } = useGlobalSearch();

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
      <IconButton
        color="inherit"
        aria-label={t("search.toggleSearch")}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <CloseIcon sx={{ fontSize: 28 }} />
        ) : (
          <SearchIcon sx={{ fontSize: 28 }} />
        )}
      </IconButton>

      <AppTopBarSearchBoxWrapper isOpen={isOpen}>
        {isOpen && (
          <SearchBoxInput
            inputRef={inputRef}
            role="searchbox"
            aria-label={t("search.search")}
            placeholder={t("search.inputPlaceholder")}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label={t("search.runSearch")}
                  onClick={() =>
                    handleSearchAction({
                      searchTerm: inputRef.current?.value ?? "",
                    })
                  }
                >
                  <KeyboardReturnIcon />
                </IconButton>
              ),
            }}
            isNarrow
            fullWidth
            onKeyDown={(e: InputKeyDown) =>
              handleSearchAction({
                searchTerm: inputRef.current?.value ?? "",
                event: e,
                setIsOpen,
              })
            }
          />
        )}
      </AppTopBarSearchBoxWrapper>
    </Box>
  );
};

export default GlobalSearchDesktop;
