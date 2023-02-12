import type { GetStaticProps } from "next";
import { DbViewSelector } from "@components/db/DbViewSelector";
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
  const { sourceLanguageName, sourceLanguage, fileName } = useDbQueryParams();
  const { sourceFile, isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, isLoading } = useQuery<ApiSegmentsData>({
    queryKey: DbApi.SegmentsData.makeQueryKey(fileName),
    queryFn: () => DbApi.SegmentsData.call(fileName),
  });

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" />
      </PageContainer>
    );
  }

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <DbViewSelector currentView="numbers" />
      <Typography variant="h2">
        File: {sourceFile} in {sourceLanguageName}
      </Typography>

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
    ["dbChn", "dbPli", "dbSkt", "dbTib"]
  );

  const queryClient = new QueryClient();

  const fileName = params?.file as string;
  await queryClient.prefetchQuery(
    DbApi.SegmentsData.makeQueryKey(fileName),
    () => DbApi.SegmentsData.call(fileName)
  );

  return {
    props: { dehydratedState: dehydrate(queryClient), ...i18nProps.props },
  };
};
