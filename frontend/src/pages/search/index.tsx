import React, { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import {
  type InputKeyDown,
  useGlobalSearch,
} from "@components/hooks/useGlobalSearch";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { SearchResults } from "@features/globalSearch";
import {
  SearchBoxInput,
  SearchBoxWrapper,
} from "@features/globalSearch/GlobalSearchStyledMuiComponents";
import NoSearchResultsFound from "@features/globalSearch/NoSearchResultsFound";
import { Close, Search } from "@mui/icons-material";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import _ from "lodash";

export default function SearchPage() {
  const { t } = useTranslation();
  const { isReady } = useRouter();

  const { dbLanguage } = useDbRouterParams();
  const { isFallback } = useSourceFile();
  const { handleSearchAction, searchParam } = useGlobalSearch();

  const [searchTerm, setSearchTerm] = useState(searchParam);

  const queryParams = {
    filters: undefined,
    language: dbLanguage,
  };

  useEffect(() => {
    if (isReady) {
      // enables search term to be set from URL if user accesses the site via a results page link
      setSearchTerm(searchParam);
    }
  }, [isReady, setSearchTerm, searchParam]);

  const { data: rawData, isLoading } = useQuery({
    queryKey: DbApi.GlobalSearchData.makeQueryKey({
      search_string: searchParam,
      ...queryParams,
    }),
    queryFn: () =>
      DbApi.GlobalSearchData.call({
        search_string: searchParam,
        ...queryParams,
      }),
  });

  const data = React.useMemo(() => {
    const sortedData = rawData
      ? rawData.sort((a, b) => b.similarity - a.similarity)
      : [];
    // see SearchResultsRow.tsx for explanation of workaround requiring chunked data
    return _.chunk(sortedData, 3);
  }, [rawData]);

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={dbLanguage}>
        <Typography variant="h2" component="h1" mb={1}>
          {t("search.pageTitle")}
        </Typography>
        <div>
          <CircularProgress
            aria-label={t("prompts.loading")}
            color="inherit"
            sx={{ flex: 1 }}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" backgroundName={dbLanguage} isQueryResultsPage>
      <Typography variant="h2" component="h1" mb={1}>
        {t("search.pageTitle")}
      </Typography>

      <SearchBoxWrapper sx={{ mb: 5 }}>
        <SearchBoxInput
          placeholder={t("search.inputPlaceholder")}
          value={searchTerm ?? ""}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <IconButton
                aria-label={t("search.runSearch")}
                onClick={() => handleSearchAction({ searchTerm })}
              >
                <Search />
              </IconButton>
            ),
            endAdornment: (
              <IconButton
                aria-label={t("search.clearSearch")}
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
          <CircularProgress
            aria-label={t("prompts.loading")}
            color="inherit"
            sx={{ flex: 1 }}
          />
        </div>
      ) : (
        <>
          {data.length > 0 ? (
            <SearchResults data={data} />
          ) : (
            <NoSearchResultsFound />
          )}
        </>
      )}
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
