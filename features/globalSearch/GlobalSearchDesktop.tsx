import React, { useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { handleOnSearchPress, handleOnSearchClick } = useGlobalSearch();

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
      <IconButton color="inherit" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <CloseIcon sx={{ fontSize: 28 }} />
        ) : (
          <SearchIcon sx={{ fontSize: 28 }} />
        )}
      </IconButton>

      <AppTopBarSearchBoxWrapper isOpen={isOpen}>
        <SearchBoxInput
          inputRef={inputRef}
          // TODO: i18n
          placeholder="Search..."
          variant="outlined"
          isNarrow={true}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() =>
                  handleOnSearchClick(inputRef.current?.value ?? "")
                }
              >
                <KeyboardReturnIcon />
              </IconButton>
            ),
          }}
          fullWidth
          onKeyDown={(e: InputKeyDown) =>
            handleOnSearchPress(e, inputRef.current?.value ?? "")
          }
        />
      </AppTopBarSearchBoxWrapper>
    </Box>
  );
};

export default GlobalSearchDesktop;
