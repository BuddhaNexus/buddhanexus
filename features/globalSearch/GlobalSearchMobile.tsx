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
  SearchBoxInput,
  SearchBoxWrapper,
} from "./GlobalSearchStyledMuiComponents";
import { handleEnterPress } from "./globalSearchUtils";

const GlobalSearchMobile = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useAtom(globalSearchTermAtom);

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
      </SearchBoxWrapper>
    </Box>
  );
};

export default GlobalSearchMobile;
