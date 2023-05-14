import React from "react";
import type { GetStaticProps } from "next";
import { DbResultsPageHead } from "@components/db/DbResultsPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbView } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { Typography } from "@mui/material";
import { dehydrate, useQuery } from "@tanstack/react-query";
import { prefetchSourceTextBrowserData } from "features/sourceTextBrowserDrawer/apiQueryUtils";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import merge from "lodash/merge";
import type { ApiGraphPageData } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getDbViewFileStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function TextPage() {
  const { sourceLanguage, fileName, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  useDbView();

  const { data, isLoading, isError } = useQuery<ApiGraphPageData>({
    queryKey: DbApi.GraphView.makeQueryKey({ fileName, queryParams }),
    queryFn: () =>
      DbApi.GraphView.call({
        fileName,
        queryParams,
      }),
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <ErrorPage backgroundName={sourceLanguage} />;
  }

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <Typography>Fallback</Typography>
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      hasSidebar={true}
    >
      <DbResultsPageHead />

      {isLoading ? (
        <CenteredProgress />
      ) : (
        data?.piegraphdata.map(([name, count]) => (
          <Typography key={name}>
            {name}: {count}
          </Typography>
        ))
      )}

      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18nProps = await getI18NextStaticProps({ locale }, ["settings"]);

  const queryClient = await prefetchSourceTextBrowserData(
    params?.language as SourceLanguage
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps
  );
};
