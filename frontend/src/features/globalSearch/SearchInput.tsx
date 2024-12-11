import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { isSearchTriggeredAtom } from "@atoms";
import { useSearchStringParam } from "@components/hooks/params";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useSetAtom } from "jotai";

import { SearchBoxInput } from "./GlobalSearchStyledMuiComponents";

type SearchInputProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerAdornmentIcon?: React.ReactNode;
};

const SearchInput = React.forwardRef(function SearchInput(
  { setIsOpen, triggerAdornmentIcon }: SearchInputProps,
  ref,
) {
  const { t } = useTranslation();
  const router = useRouter();
  const [search_string, setSearchStringParam] = useSearchStringParam();

  const setIsSearchTriggered = useSetAtom(isSearchTriggeredAtom);

  const triggerSearchAndNavigate = React.useCallback(
    async (input: string) => {
      setIsSearchTriggered(true);
      await router.push({
        pathname: "/search",
        query: { search_string: input },
      });
    },
    [router, setIsSearchTriggered],
  );

  const handleSearchAndNavigateKeydown = React.useCallback(
    async ({
      input,
      event,
      setOpen,
    }: {
      input: string;
      event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>;
      setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    }) => {
      if (event?.key === "Escape" && setOpen) {
        setOpen((prev) => !prev);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        setIsSearchTriggered(true);
        await router.push({
          pathname: "/search",
          query: { search_string: input },
        });
      }
    },
    [router, setIsSearchTriggered],
  );

  return (
    <SearchBoxInput
      inputRef={ref}
      role="searchbox"
      aria-label={t("search.search")}
      placeholder={t("search.inputPlaceholder")}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <IconButton
            aria-label={t("search.clearSearch")}
            onClick={() => setSearchStringParam("")}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ),
        endAdornment: (
          <IconButton
            aria-label={t("search.runSearch")}
            disabled={!search_string}
            onClick={() => triggerSearchAndNavigate(search_string)}
          >
            {triggerAdornmentIcon ?? <SearchIcon fontSize="inherit" />}
          </IconButton>
        ),
      }}
      isNarrow
      fullWidth
      onChange={(event: any) => setSearchStringParam(event.target.value)}
      onKeyDown={(event: any) =>
        handleSearchAndNavigateKeydown({
          input: search_string,
          event,
          setOpen: setIsOpen,
        })
      }
    />
  );
});

type SearchInputRendererProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerAdornmentIcon?: React.ReactNode;
};

const SearchInputRenderer = React.forwardRef(function SearchInputRenderer(
  props: SearchInputRendererProps,
  ref,
) {
  if (!props.isOpen) return null;

  return <SearchInput ref={ref} {...props} />;
});

export default SearchInputRenderer;
