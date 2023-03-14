import type { GetStaticProps } from "next";
import { DbResultsPageHead } from "@components/db/DbResultsPageHead";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress, Typography } from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { ApiSegmentsData } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceTextStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function NumbersPage() {
  const { sourceLanguage, fileName, serializedParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, isLoading } = useQuery<ApiSegmentsData>({
    queryKey: [DbApi.SegmentsData.makeQueryKey(fileName), serializedParams],
    queryFn: () => DbApi.SegmentsData.call(fileName, serializedParams),
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

      {/* Just printing some example data: */}
      {/* The deta should probably be transformed according to our needs before using it here. */}

      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        data?.collections[0].map((collection) => {
          const [[collectionId, collectionName]] = Object.entries(collection);
          return (
            <Typography key={collectionId}>
              {collectionId}: {collectionName}
            </Typography>
          );
        })
      )}
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
  await queryClient.prefetchQuery(
    DbApi.SegmentsData.makeQueryKey(fileName),
    () => DbApi.SegmentsData.call(fileName, "?page=0")
  );

  return {
    props: { dehydratedState: dehydrate(queryClient), ...i18nProps.props },
  };
};
