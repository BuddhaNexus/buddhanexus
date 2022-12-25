import type { GetStaticProps } from "next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress, Typography } from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import merge from "lodash/merge";
import type { ApiGraphPageData } from "types/api";
import { DbApi } from "utils/api/db";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceTextStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function GraphPage() {
  const { sourceLanguageName, sourceLanguage, fileName } = useDbQueryParams();
  const { sourceFile, isFallback } = useSourceFile();

  const { data, isLoading } = useQuery<ApiGraphPageData>({
    queryKey: DbApi.GraphPage.makeQueryKey(fileName),
    queryFn: () => DbApi.GraphPage.call(fileName),
  });

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" />
      </PageContainer>
    );
  }

  // TODO: add error handling

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <Typography variant="h1">Graph view for {sourceLanguageName}.</Typography>
      <Typography variant="h2">File: {sourceFile}</Typography>

      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        data?.piegraphdata.map(([name, count]) => (
          <Typography key={name}>
            {name}: {count}
          </Typography>
        ))
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
  await queryClient.prefetchQuery(DbApi.GraphPage.makeQueryKey(fileName), () =>
    DbApi.GraphPage.call(fileName)
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps
  );
};
