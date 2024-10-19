import React, { useMemo } from "react";
import {
  // GetStaticProps,
  GetServerSideProps,
} from "next";
import { useTranslation } from "next-i18next";
// import { getValidDbLanguage } from "@utils/validators";
// import { getI18NextStaticProps } from "@utils/nextJsHelpers";
// import merge from "lodash/merge";
// export { getDbViewFileStaticPaths as getStaticPaths } from "@utils/nextJsHelpers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSetDbViewFromPath } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { DbSourceBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";

import { HistogramDataChart } from "@features/graphView/HistogramDataChart";
import { PieDataChart } from "@features/graphView/PieDataChart";
import { Box, Paper, Typography } from "@mui/material";
import {
  // dehydrate,
  useQuery,
} from "@tanstack/react-query";
// import { prefetchDbResultsPageData } from "@utils/api/apiQueryUtils";
import { DbApi } from "@utils/api/dbApi";

const HISTOGRAM_DATA_MATCH_LIMIT = 50;

const GraphContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Paper sx={{ my: 2, minHeight: "500px", flex: 1 }}>{children}</Paper>;

export default function GraphPage() {
  const { dbLanguage, fileName } = useDbRouterParams();
  const { isFallback } = useSourceFile();

  useSetDbViewFromPath();

  const { t } = useTranslation();

  // const requestBody = React.useMemo(
  //   () => ({
  //     filename: fileName,
  //     score: score ? Number(score) : defaultQueryParams.score,
  //     par_length: par_length
  //       ? Number(par_length)
  //       : defaultQueryParams.par_length,
  //     // TODO: Add target_collection when available / or remove
  //     target_collection: [],
  //   }),
  //   [fileName, score, par_length, defaultQueryParams]
  // );

  const requestBody = {
    filename: fileName,
    score: 50,
    par_length: 50,
    target_collection: [],
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: DbApi.GraphView.makeQueryKey(requestBody),
    queryFn: () => DbApi.GraphView.call(requestBody),
  });

  const filteredHistogramData = useMemo(
    () => data?.histogramgraphdata.slice(0, HISTOGRAM_DATA_MATCH_LIMIT) ?? [],
    [data?.histogramgraphdata]
  );

  if (isError) {
    return <ErrorPage backgroundName={dbLanguage} />;
  }

  if (isFallback) {
    return (
      <PageContainer backgroundName={dbLanguage}>
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" backgroundName={dbLanguage} isQueryResultsPage>
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
      <DbSourceBrowserDrawer />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "settings"])),
  },
});

// export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
//   const i18nProps = await getI18NextStaticProps({ locale }, [
//     "common",
//     "settings",
//   ]);
//
//   const queryClient = await prefetchDbResultsPageData(
//     getValidLanguage(params?.language),
//     params?.file as string,
//   );
//
//   return merge(
//     { props: { dehydratedState: dehydrate(queryClient) } },
//     i18nProps,
//   );
// };
