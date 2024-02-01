import React, { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
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
import { type SearchPageResults } from "utils/api/search";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function SearchPage() {
  // IN DEVELOPMENT
  const { t } = useTranslation();
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
  const { data, fetchNextPage, fetchPreviousPage, isLoading } =
    useInfiniteQuery<PagedResponse<SearchPageResults>>({
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
        lastPage.pageNumber === 0
          ? lastPage.pageNumber
          : lastPage.pageNumber - 1,
    });

  // TODO: awaiting paginated data; refactor once backend work is done.
  // const allData = React.useMemo(
  //   () => (data ? data.pages.flatMap((page) => page.data) : []),
  //   [data]
  // );
  // <---- temporary handling
  const allData = React.useMemo(() => {
    const sortedData = data
      ? data.pages[0]?.data
          .sort((a, b) => b.matchCenteredness - a.matchCenteredness)
          .sort((a, b) => a.matchDistance - b.matchDistance)
      : [];
    return sortedData;
  }, [data]);
  // ----->

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <Typography variant="h2" component="h1" mb={1}>
          {t("search.pageTitle")}
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
        {t("search.pageTitle")}
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

      {isLoading ? (
        <div>
          {/* TODO: i18n */}
          <CircularProgress
            aria-label="loading"
            color="inherit"
            sx={{ flex: 1 }}
          />
        </div>
      ) : (
        <>
          {data ? (
            <>
              <Typography>{allData?.length} Results</Typography>
              <SearchResults
                data={allData}
                onEndReached={fetchNextPage}
                onStartReached={fetchPreviousPage}
              />
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
    ["settings"],
  );

  return {
    props: {
      ...i18nProps.props,
    },
  };
};
