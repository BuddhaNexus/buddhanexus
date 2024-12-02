import React from "react";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { isSearchTriggeredAtom } from "@atoms";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { ResultQueryError } from "@components/db/ResultQueryError";
import { useDbQueryFilters } from "@components/hooks/groupedQueryParams";
import { useSearchStringParam } from "@components/hooks/params";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { SearchResults } from "@features/globalSearch";
import NoSearchResultsFound from "@features/globalSearch/NoSearchResultsFound";
import SearchPageInputBox from "@features/globalSearch/SearchPageInputBox";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import { useAtom } from "jotai";
import _ from "lodash";

const SearchPageHeader = ({ matches }: { matches: number }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h2" component="h1" mb={2}>
        {t("search.pageTitle")}
      </Typography>
      <SearchPageInputBox />
      <QueryPageTopStack matchCount={matches} />
    </>
  );
};

export default function SearchPage() {
  const { isFallback } = useSourceFile();

  const [search_string] = useSearchStringParam();
  const filters = useDbQueryFilters();

  const [isSearchTriggered, setIsSearchTriggered] = useAtom(
    isSearchTriggeredAtom,
  );

  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
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

  const matches = rawData?.length ?? 0;

  if (isError) {
    return (
      <PageContainer maxWidth="xl" isQueryResultsPage>
        <SearchPageHeader matches={matches} />
        <ResultQueryError errorMessage={error?.message} />
      </PageContainer>
    );
  }

  if (isFallback || isLoading) {
    return (
      <PageContainer maxWidth="xl" isQueryResultsPage>
        <SearchPageHeader matches={matches} />
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" isQueryResultsPage>
      <SearchPageHeader matches={matches} />

      {data.length > 0 ? (
        <SearchResults data={data} />
      ) : (
        <NoSearchResultsFound />
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
