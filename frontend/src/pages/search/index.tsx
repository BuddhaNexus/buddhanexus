import React from "react";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { isSearchTriggeredAtom } from "@atoms";
import { InfiniteLoadingSpinner } from "@components/common/LoadingSpinner";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { ResultQueryError } from "@components/db/ResultQueryError";
import { useDbQueryFilters } from "@components/hooks/groupedQueryParams";
import { useSearchStringParam } from "@components/hooks/params";
import { PageContainer } from "@components/layout/PageContainer";
import { SearchResults } from "@features/globalSearch";
import SearchPageInputBox from "@features/globalSearch/SearchPageInputBox";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import { useAtom } from "jotai";
import chunk from "lodash/chunk";

const StaleResultsOverlay = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: "-0.75rem",
        top: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
};

const SearchPageHeader = ({ matches }: { matches: number }) => {
  const { t } = useTranslation();
  return (
    <Box mb={2}>
      <SearchPageInputBox />
      <QueryPageTopStack matchCount={matches} title={t("search.pageTitle")} />
    </Box>
  );
};

export default function SearchPage() {
  const [search_string] = useSearchStringParam();

  const filters = useDbQueryFilters();

  const {
    language,
    exclude_collections,
    exclude_categories,
    exclude_files,
    include_collections,
    include_categories,
    include_files,
  } = filters;

  const [isSearchTriggered, setIsSearchTriggered] = useAtom(
    isSearchTriggeredAtom,
  );

  // initializes search trigger when user navigates to search results page from outside the app
  const isExternalInitialLoad = React.useRef(!isSearchTriggered);

  React.useEffect(() => {
    if (isExternalInitialLoad.current) {
      isExternalInitialLoad.current = false;
      setIsSearchTriggered(true);
    }
  }, [setIsSearchTriggered]);

  React.useEffect(() => {
    setIsSearchTriggered(true);
  }, [
    setIsSearchTriggered,
    language,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify([
      exclude_collections,
      exclude_categories,
      exclude_files,
      include_collections,
      include_categories,
      include_files,
    ]),
  ]);

  const { data, isLoading, isError, error, isFetching, isFetched } = useQuery({
    queryKey: DbApi.GlobalSearchData.makeQueryKey({
      search_string,
      filters,
    }),
    queryFn: () => {
      return DbApi.GlobalSearchData.call({
        search_string,
        filters,
      });
    },
    placeholderData: (prev) => prev,
    enabled: Boolean(search_string && isSearchTriggered),
  });

  const chunkedData = React.useMemo(() => {
    const sortedData = data
      ? data.sort((a, b) => b.similarity - a.similarity)
      : [];
    // see SearchResultsRow.tsx for explanation of workaround requiring chunked data
    return chunk(sortedData, 3);
  }, [data]);

  const matches = data?.length ?? 0;

  if (isFetched) {
    setIsSearchTriggered(false);
  }

  if (isError) {
    return (
      <PageContainer maxWidth="xl" isQueryResultsPage>
        <SearchPageHeader matches={matches} />
        <ResultQueryError errorMessage={error?.message} />
      </PageContainer>
    );
  }

  if (isLoading || isFetching || isExternalInitialLoad.current) {
    return (
      <PageContainer maxWidth="xl" isQueryResultsPage>
        <SearchPageHeader matches={matches} />
        <InfiniteLoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" isQueryResultsPage>
      <SearchPageHeader matches={matches} />
      <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
        {data ? <SearchResults data={chunkedData} /> : null}
        {data && !isFetched ? <StaleResultsOverlay /> : null}
      </Box>
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
