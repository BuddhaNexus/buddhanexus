import React from "react";
import { useRouter } from "next/router";
import { globalSearchTermAtom } from "pages/search";
import { Link } from "@components/common/Link";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useAtom } from "jotai";

import {
  MobileSearchBoxInput,
  MobileSearchBoxWrapper,
} from "./GlobalSearchSyledMuiComponents";
import { handleEnterPress } from "./globalSearchUtils";

const GlobalSearchMobile = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useAtom(globalSearchTermAtom);

  return (
    <Box
      position="relative"
      sx={{
        my: 2,
        width: "100%",
        height: "48px",
      }}
    >
      <MobileSearchBoxWrapper>
        <MobileSearchBoxInput
          placeholder="Search..."
          variant="outlined"
          value={searchTerm}
          InputProps={{
            startAdornment: (
              <Link variant="button" href="/search">
                <IconButton>
                  <SearchIcon fontSize="inherit" />
                </IconButton>
              </Link>
            ),
            endAdornment: (
              <IconButton onClick={() => setSearchTerm("")}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            ),
          }}
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
            handleEnterPress({ e, searchTerm, router })
          }
        />
      </MobileSearchBoxWrapper>
    </Box>
  );
};

export default GlobalSearchMobile;
