import React from "react";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { isSearchTriggeredAtom } from "@atoms";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbQueryFilters } from "@components/hooks/groupedQueryParams";
import { useSearchStringParam } from "@components/hooks/params";
import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";
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
import { useAtom } from "jotai";
import _ from "lodash";

export default function SearchPage() {
  const { t } = useTranslation();

  const { dbLanguage } = useNullableDbRouterParams();
  const { isFallback } = useSourceFile();

  const [search_string, setSearchStringParam] = useSearchStringParam();
  const filters = useDbQueryFilters();

  const [isSearchTriggered, setIsSearchTriggered] = useAtom(
    isSearchTriggeredAtom,
  );

  const handleKeydown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setIsSearchTriggered(true);
      }
    },
    [setIsSearchTriggered],
  );

  const { data: rawData, isLoading } = useQuery({
    queryKey: DbApi.GlobalSearchData.makeQueryKey({
      search_string,
      filters,
    }),
    queryFn: () => {
      setIsSearchTriggered(false);
      return DbApi.GlobalSearchData.call({
        search_string,
        filters,
      });
    },
    enabled: isSearchTriggered,
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
          onChange={(event) => setSearchStringParam(event.target.value)}
          onKeyDown={handleKeydown}
        />
      </SearchBoxWrapper>

      <QueryPageTopStack matches={rawData?.length} />

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
