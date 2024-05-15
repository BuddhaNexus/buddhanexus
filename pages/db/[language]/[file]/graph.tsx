import React, { useMemo } from "react";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbView } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { dehydrate, useQuery } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import merge from "lodash/merge";
import { prefetchDbResultsPageData } from "utils/api/apiQueryUtils";
import { DbApi } from "utils/api/dbApi";
import type { ApiGraphPageData } from "utils/api/endpoints/graph-view/graph";
import { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getDbViewFileStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

import { Box, Paper, Typography } from "@mui/material";
import { GRAPH_BG_COLOR } from "features/graphView/constants";
import { HistogramDataChart } from "features/graphView/HistogramDataChart";
import { PieDataChart } from "features/graphView/PieDataChart";

const HISTOGRAM_DATA_MATCH_LIMIT = 50;

const GraphContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Paper
    sx={{ backgroundColor: GRAPH_BG_COLOR, my: 2, flex: 1, minHeight: "500px" }}
  >
    {children}
  </Paper>
);

export default function GraphPage() {
  const { sourceLanguage, fileName, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  useDbView();

  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery<ApiGraphPageData>({
    queryKey: DbApi.GraphView.makeQueryKey({
      file_name: fileName,
      ...queryParams,
    }),
    queryFn: () =>
      DbApi.GraphView.call({
        fileName,
        queryParams,
      }),
  });

  const filteredHistogramData = useMemo(
    () => data?.histogramgraphdata.slice(0, HISTOGRAM_DATA_MATCH_LIMIT) ?? [],
    [data?.histogramgraphdata],
  );

  if (isError) {
    return <ErrorPage backgroundName={sourceLanguage} />;
  }

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      isQueryResultsPage
    >
      <DbViewPageHead />

      {isLoading ? (
        <CenteredProgress />
      ) : (
        <Box
          sx={{
            display: "flex",
            height: "200vh",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" sx={{ my: 2 }}>
            {t("graph.pieDataTitle")}
          </Typography>
          <Typography variant="subtitle1">
            {t("graph.pieDataSubtitle")}
          </Typography>

          <GraphContainer>
            <PieDataChart data={data?.piegraphdata} />
          </GraphContainer>

          <Typography variant="h4" sx={{ my: 2 }}>
            {t("graph.histogramDataTitle")}
          </Typography>
          <Typography variant="subtitle1">
            {t("graph.histogramDataSubtitle")}
          </Typography>

          <GraphContainer>
            <HistogramDataChart
              chartType="Histogram"
              data={filteredHistogramData}
            />
          </GraphContainer>

          <GraphContainer>
            <HistogramDataChart
              chartType="ScatterChart"
              data={filteredHistogramData}
            />
          </GraphContainer>
        </Box>
      )}
      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18nProps = await getI18NextStaticProps({ locale }, [
    "common",
    "settings",
  ]);

  const queryClient = await prefetchDbResultsPageData(
    params?.language as SourceLanguage,
    params?.file as string,
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
