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
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchResults } from "features/globalSearch";
import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "features/globalSearch/GlobalSearchStyledMuiComponents";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import type { PagedResponse } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

import { tempSearchData } from "./tempData";

export default function SearchPage() {
  // IN DEVELOPMENT
  const { isReady } = useRouter();

  // TODO: fix server error if no search term
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchNextPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchPreviousPage,
    isLoading,
  } = useInfiniteQuery<PagedResponse<any>>({
    initialPageParam: 0,
    queryKey: DbApi.GlobalSearchData.makeQueryKey({
      searchTerm: searchParam,
      queryParams,
    }),
    queryFn: ({ pageParam }) =>
      DbApi.GlobalSearchData.call({
        searchTerm: searchParam,
        pageNumber: pageParam as number,
        queryParams,
      }),
    getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
    getPreviousPageParam: (lastPage) =>
      lastPage.pageNumber === 0 ? lastPage.pageNumber : lastPage.pageNumber - 1,
  });

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        {/* TODO: align other results pages to match this. To avoide CLS and for logical flow, it makes sense for this to be the first element. */}
        <Typography variant="h2" component="h1" mb={1}>
          {/* TODO: i18n */}
          Search Results
        </Typography>
        <div>
          <CircularProgress
            aria-label="loading"
            color="inherit"
            sx={{ flex: 1 }}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      isQueryResultsPage
    >
      <Typography variant="h2" component="h1" mb={1}>
        {/* TODO: i18n */}
        Search Results
      </Typography>

      <SearchBoxWrapper sx={{ mb: 5 }}>
        {/* TODO: fix search OR add notification of search limitations (whole word only) */}
        <SearchBoxInput
          placeholder="Enter search term"
          value={searchTerm ?? ""}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <IconButton
                aria-label="Run search"
                onClick={() => handleOnSearch(searchTerm)}
              >
                <Search />
              </IconButton>
            ),
            endAdornment: (
              <IconButton
                aria-label="Clear search field"
                onClick={() => setSearchTerm("")}
              >
                <Close />
              </IconButton>
            ),
          }}
          autoFocus
          fullWidth
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(e: InputKeyDown) => handleOnSearch(searchTerm, e)}
        />
      </SearchBoxWrapper>

      <QueryPageTopStack />

      <SearchResults
        data={tempSearchData.searchResults}
        onEndReached={fetchNextPage}
        onStartReached={fetchPreviousPage}
      />

      {/* TODO: componentize search results */}
      {isLoading ? (
        <div>
          {/* TODO: i18n
          <CircularProgress
            aria-label="loading"
            color="inherit"
            sx={{ flex: 1 }}
          /> */}
        </div>
      ) : (
        <div />
        // <>
        //   {data ? (
        //     <>
        //       {data.pages.flatMap((page) => (
        //         <React.Fragment key={page.pageNumber}>
        //           <Typography>{page.data.total} Results</Typography>
        //           <SearchResults
        //             data={tempSearchData}
        //             onEndReached={fetchNextPage}
        //             onStartReached={fetchPreviousPage}
        //           />
        //         </React.Fragment>
        //       ))}
        //     </>
        //   ) : (
        //     <>
        //       {/* TODO: i18n */}
        //       <Typography>No results.</Typography>
        //     </>
        //   )}
        // </>
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
    ["settings", "common"],
  );

  return {
    props: {
      ...i18nProps.props,
    },
  };
};
