import React from "react";
import type { GetStaticProps } from "next";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
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
import type { ApiNumbersPageData } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getDbViewFileStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function NumbersPage() {
  const { sourceLanguage, fileName, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();
  useDbView();

  const { data, isLoading, isError } = useQuery<ApiNumbersPageData>({
    queryKey: DbApi.NumbersView.makeQueryKey({ fileName, queryParams }),
    queryFn: () =>
      DbApi.NumbersView.call({
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
      <DbViewPageHead />

      {/* Just printing some example data: */}
      {/* The deta should probably be transformed according to our needs before using it here. */}

      {isLoading ? (
        <CenteredProgress />
      ) : (
        <>
          {data?.collections &&
            data.collections[0].map((collection) => {
              const [[collectionId, collectionName]] =
                Object.entries(collection);
              return (
                <Typography key={collectionId}>
                  {collectionId}: {collectionName}
                </Typography>
              );
            })}
        </>
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
