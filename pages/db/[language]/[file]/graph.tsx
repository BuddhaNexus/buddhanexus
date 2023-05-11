import React from "react";
import type { GetStaticProps } from "next";
import { DbResultsPageHead } from "@components/db/DbResultsPageHead";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbView } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress, Typography } from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import type { ApiGraphPageData } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceTextStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function GraphPage() {
  const { sourceLanguage, fileName, serializedParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  useDbView();

  // TODO: add error handling
  const { data, isLoading } = useQuery<ApiGraphPageData>({
    queryKey: [DbApi.GraphView.makeQueryKey(fileName), serializedParams],
    queryFn: () => DbApi.GraphView.call(fileName, serializedParams),
    refetchOnWindowFocus: false,
  });

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" />
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
        <CircularProgress color="inherit" />
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
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["settings"]
  );

  const queryClient = new QueryClient();

  const fileName = params?.file as string;
  await queryClient.prefetchQuery(DbApi.GraphView.makeQueryKey(fileName), () =>
    DbApi.GraphView.call(fileName, ``)
  );

  return {
    props: { dehydratedState: dehydrate(queryClient), ...i18nProps.props },
  };
};
