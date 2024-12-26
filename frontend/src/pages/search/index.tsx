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
import SearchPageInputBox from "@features/globalSearch/SearchPageInputBox";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import { useAtom } from "jotai";
import chunk from "lodash/chunk";

const InvalidatedResultsOverlay = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: "-40rem",
        right: "-40rem",
        height: "100%",
        mt: 1.5,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
};

const SearchPageHeader = ({ matches }: { matches: number }) => {
  const { t } = useTranslation();
  return (
    <>
      <SearchPageInputBox />
      <QueryPageTopStack
        matchCount={matches}
        title={t("search.pageTitle")}
        subtitle=""
      />
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
    isFetched,
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
    placeholderData: (prev) => prev,
    enabled: isSearchTriggered,
  });

  const data = React.useMemo(() => {
    const sortedData = rawData
      ? rawData.sort((a, b) => b.similarity - a.similarity)
      : [];
    // see SearchResultsRow.tsx for explanation of workaround requiring chunked data
    return chunk(sortedData, 3);
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

      <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
        <SearchResults data={data} />
        {isFetched ? null : <InvalidatedResultsOverlay />}
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
