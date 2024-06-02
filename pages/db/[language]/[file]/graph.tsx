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
  const {
    sourceLanguage,
    fileName,
    queryParams: { score, par_length, target_collection },
    defaultQueryParams,
  } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  useDbView();

  const { t } = useTranslation();

  const requestBody = React.useMemo(
    () => ({
      file_name: fileName,
      score: score ? Number(score) : defaultQueryParams.score,
      par_length: par_length
        ? Number(par_length)
        : defaultQueryParams.par_length,
      // TODO: Add target_collection when available
      target_collection: undefined,
    }),
    [fileName, score, par_length, target_collection, defaultQueryParams],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: DbApi.GraphView.makeQueryKey(requestBody),
    queryFn: () => DbApi.GraphView.call(requestBody),
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

          <Box sx={{ maxWidth: "900px" }}>
            <GraphContainer>
              <PieDataChart data={data?.piegraphdata} />
            </GraphContainer>
          </Box>

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
