import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { globalSearchTermAtom } from "pages/search";
import { Link } from "@components/common/Link";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useAtom } from "jotai";

import {
  AppTopBarSearchBoxWrapper,
  SearchBoxInput,
} from "./GlobalSearchStyledMuiComponents";
import { handleSearchInputEnterPress } from "./globalSearchUtils";

const GlobalSearchDesktop = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useAtom(globalSearchTermAtom);

  const handleSearchIconClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsOpen((open) => !open);
    if (!isOpen) {
      setSearchTerm("");
    }
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

      <AppTopBarSearchBoxWrapper isOpen={isOpen}>
        <SearchBoxInput
          inputRef={inputRef}
          // TODO: i18n
          placeholder="Search..."
          variant="outlined"
          isNarrow={true}
          value={searchTerm}
          InputProps={{
            endAdornment: (
              <Link variant="button" href="/search" mr={1}>
                <IconButton>
                  <KeyboardReturnIcon />
                </IconButton>
              </Link>
            ),
          }}
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
            handleSearchInputEnterPress({ e, searchTerm, router })
          }
        />
      </AppTopBarSearchBoxWrapper>
    </Box>
  );
};

export default GlobalSearchDesktop;
