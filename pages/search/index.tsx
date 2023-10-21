import React, { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
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
  // IN DEVELOPMENT
  const { isReady } = useRouter();

  const { sourceLanguage, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  const { handleOnSearch, searchParam } = useGlobalSearch();

  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    if (isReady) {
      // enables search term to be set from URL if user accesses the site via a results page link
      setSearchTerm(searchParam);
    }
  }, [isReady, setSearchTerm, searchParam]);

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
    <PageContainer maxWidth="xl" backgroundName={sourceLanguage} isQueryPage>
      <QueryPageTopStack />
      <SearchBoxWrapper sx={{ mb: 5 }}>
        {/* TODO: fix search OR add notification of search limitations (whole word only) */}
        <SearchBoxInput
          placeholder="Enter search term"
          value={searchTerm ?? ""}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <IconButton onClick={() => handleOnSearch(searchTerm)}>
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
          onKeyDown={(e: InputKeyDown) => handleOnSearch(searchTerm, e)}
        />
      </SearchBoxWrapper>

      {/* TODO: componentize search results */}
      {!isLoading && (
        <>
          {data ? (
            <>
              {data.pages.flatMap((page) => (
                <React.Fragment key={page.pageNumber}>
                  <Typography>{page.data.total} Results</Typography>
                  <Grid
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    container
                  >
                    <ul>
                      {[...(page.data.results.values() ?? [])].map((result) => (
                        <li key={result.id}>
                          <Typography variant="h3" component="h2">
                            {result.id}
                          </Typography>
                          <Typography component="p">
                            {result.fileName}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Grid>
                </React.Fragment>
              ))}
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
    ["settings", "common"]
  );

  return {
    props: {
      ...i18nProps.props,
    },
  };
};
