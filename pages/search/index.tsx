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
import { useQuery } from "@tanstack/react-query";
import { SearchResults } from "features/globalSearch";
import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "features/globalSearch/GlobalSearchStyledMuiComponents";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import { DbApi } from "utils/api/dbApi";
import { type SearchPageResults } from "utils/api/search";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

function chunkArray(array: SearchPageResults, chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export default function SearchPage() {
  // IN DEVELOPMENT
  const { t } = useTranslation();
  const { isReady } = useRouter();

  // TODO: fix server error if no search term
  const { sourceLanguage, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  const { handleSearchAction, searchParam } = useGlobalSearch();

  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    if (isReady) {
      // enables search term to be set from URL if user accesses the site via a results page link
      setSearchTerm(searchParam);
    }
  }, [isReady, setSearchTerm, searchParam]);

  // TODO: data / query handling (awaiting endpoints update & codegen types to be impletmented)
  const { data: rawData, isLoading } = useQuery<SearchPageResults>({
    queryKey: DbApi.GlobalSearchData.makeQueryKey({
      searchTerm: searchParam,
      queryParams,
    }),
    queryFn: () =>
      DbApi.GlobalSearchData.call({
        searchTerm: searchParam,
        queryParams,
      }),
  });

  const data = React.useMemo(() => {
    const sortedData = rawData
      ? rawData.sort((a, b) => b.similarity - a.similarity)
      : [];
    // see SearchResultsRow.tsx for explanation of workaround needing chunked data
    return chunkArray(sortedData, 3);
  }, [rawData]);

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
                onClick={() => handleSearchAction({ searchTerm })}
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
          fullWidth
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(e: InputKeyDown) =>
            handleSearchAction({ searchTerm, event: e })
          }
        />
      </SearchBoxWrapper>

      <QueryPageTopStack matches={rawData?.length ?? 0} />

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
          {data.length > 0 ? (
            <SearchResults data={data} />
          ) : (
            <>
              {/* TODO: i18n */}
              <Typography>No results found. Try search for…</Typography>
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
