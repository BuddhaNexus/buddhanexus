import React, { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { DbResultsPageHead } from "@components/db/DbResultsPageHead";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  type InputKeyDown,
  useGlobalSearch,
} from "@components/hooks/useGlobalSearch";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { Close, Search } from "@mui/icons-material";
import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "features/globalSearch/GlobalSearchStyledMuiComponents";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import type { PagedResponse } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function SearchPage() {
  const { isReady } = useRouter();

  const { sourceLanguage, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  const { handleOnSearchPress, handleOnSearchClick, searchParam } =
    useGlobalSearch();

  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    if (isReady) {
      // enables search term to be set from URL if user accesses the site via a results page link
      setSearchTerm(searchParam);
    }
  }, [isReady, setSearchTerm]);

  // TODO: data / query handling (awaiting endpoints update & codegen types to be impletmented)
  const {
    data,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchNextPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchPreviousPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isInitialLoading,
    isLoading,
  } = useInfiniteQuery<PagedResponse<any>>({
    queryKey: DbApi.GlobalSearchData.makeQueryKey({
      searchTerm: searchParam,
      queryParams,
    }),
    queryFn: ({ pageParam = 0 }) =>
      DbApi.GlobalSearchData.call({
        searchTerm: searchParam,
        pageNumber: pageParam,
        queryParams,
      }),
    getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
    getPreviousPageParam: (lastPage) =>
      lastPage.pageNumber === 0 ? lastPage.pageNumber : lastPage.pageNumber - 1,
  });

  if (isFallback || !isReady) {
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
      <DbResultsPageHead hasSearchBox={false} />
      <SearchBoxWrapper sx={{ mb: 5 }}>
        {/* TODO: fix search OR add notification of search limitations (whole word only) */}
        <SearchBoxInput
          placeholder="Enter search term"
          value={searchTerm ?? ""}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <IconButton onClick={() => handleOnSearchClick(searchTerm)}>
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
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(e: InputKeyDown) => handleOnSearchPress(e, searchTerm)}
        />
      </SearchBoxWrapper>

      {/* TODO: componentize search results */}
      {!isLoading && (
        <>
          {data ? (
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
                        {item.thing}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Grid>
            </>
          ) : (
            <>
              {/* TODO: i18n */}
              <Typography>No results.</Typography>
            </>
          )}
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
