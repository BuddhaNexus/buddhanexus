// TODO: Page! This is currently a rough frame; receiving API data, functionality and display incomplete.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { GetStaticProps } from "next";
import { DbResultsPageHead } from "@components/db/DbResultsPageHead";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { Close, Search } from "@mui/icons-material";
import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "features/globalSearch/GlobalSearchSyledMuiComponents";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import { atom, useAtom } from "jotai";
import { debounce } from "lodash";
import type { PagedResponse } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import type { SearchPageData } from "utils/api/search";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export const globalSearchTermAtom = atom<string>("");

export default function SearchPage() {
  const { sourceLanguage, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  // TODO: convert to query param as suitable
  const [searchTerm, setSearchTerm] = useAtom(globalSearchTermAtom);
  const [searchValue, setSearchValue] = useState(searchTerm);

  useEffect(() => {}, [searchTerm]);

  // TODO: confirm acceptance criteria - debounced search / search on enter?
  const setDebouncedSearchTerm = useMemo(
    () => debounce(setSearchTerm, 600),
    [setSearchTerm]
  );

  const handleChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      setDebouncedSearchTerm(value);
    },
    [setSearchValue, setDebouncedSearchTerm]
  );

  const {
    data,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchNextPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchPreviousPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isInitialLoading,
    isLoading,
  } = useInfiniteQuery<PagedResponse<SearchPageData>>({
    queryKey: DbApi.GlobalSearchData.makeQueryKey({
      searchTerm,
      queryParams,
    }),
    queryFn: ({ pageParam = 0 }) =>
      DbApi.GlobalSearchData.call({
        searchTerm,
        pageNumber: pageParam,
        queryParams,
      }),
    getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
    getPreviousPageParam: (lastPage) =>
      lastPage.pageNumber === 0 ? lastPage.pageNumber : lastPage.pageNumber - 1,
  });

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      hasSidebar={true}
    >
      <DbResultsPageHead />
      <SearchBoxWrapper sx={{ mb: 5 }}>
        {/* TODO: notification of search limitations (whole word only) */}
        <SearchBoxInput
          placeholder="Enter search term"
          value={searchValue}
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
            endAdornment: (
              <IconButton onClick={() => setSearchTerm("")}>
                <Close />
              </IconButton>
            ),
          }}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          fullWidth
          onChange={(event) => handleChange(event.target.value)}
        />
      </SearchBoxWrapper>

      {/* TODO: handling & i18n */}
      {!searchTerm && <Typography>No results.</Typography>}

      {isLoading && <CircularProgress />}

      {/* TODO: componentize search results */}
      {searchTerm && !isLoading && (
        <>
          <Typography>{data?.pages[0].data.size} Results</Typography>
          <Grid
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            container
          >
            <ul>
              {[...(data?.pages[0].data.values() ?? [])].map((item) => (
                <li key={item.id}>
                  <Typography variant="h3" component="h2">
                    {item.id}
                  </Typography>
                </li>
              ))}
            </ul>
          </Grid>
        </>
      )}

      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["settings"]
  );

  return {
    props: {
      ...i18nProps.props,
    },
  };
};
