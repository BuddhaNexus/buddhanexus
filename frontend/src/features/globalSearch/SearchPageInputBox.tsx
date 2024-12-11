import React from "react";
import { useTranslation } from "next-i18next";
import { isSearchTriggeredAtom } from "@atoms";
import { useSearchStringParam } from "@components/hooks/params";
import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "@features/globalSearch/GlobalSearchStyledMuiComponents";
import { Close, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useSetAtom } from "jotai";

export default function SearchPageInputBox() {
  const { t } = useTranslation();

  const [search_string, setSearchStringParam] = useSearchStringParam();

  const setIsSearchTriggered = useSetAtom(isSearchTriggeredAtom);

  const handleKeydown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setIsSearchTriggered(true);
      }
    },
    [setIsSearchTriggered],
  );

  return (
    <SearchBoxWrapper sx={{ mb: 5 }}>
      <SearchBoxInput
        placeholder={t("search.inputPlaceholder")}
        value={search_string}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <IconButton
              aria-label={t("search.clearSearch")}
              onClick={() => setSearchStringParam(null)}
            >
              <Close />
            </IconButton>
          ),
          endAdornment: (
            <IconButton
              aria-label={t("search.runSearch")}
              disabled={!search_string}
              onClick={() => setIsSearchTriggered(true)}
            >
              <Search />
            </IconButton>
          ),
        }}
        fullWidth
        onChange={(event: any) => setSearchStringParam(event.target.value)}
        onKeyDown={handleKeydown}
      />
    </SearchBoxWrapper>
  );
}
