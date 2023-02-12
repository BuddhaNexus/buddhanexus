import type { GetStaticProps } from "next";
import { DbViewSelector } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress, Typography } from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { ApiGraphPageData } from "types/api/common";
import { DbApi } from "utils/api/db";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceTextStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function GraphPage() {
  const { sourceLanguageName, sourceLanguage, fileName } = useDbQueryParams();
  const { sourceFile, isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, isLoading } = useQuery<ApiGraphPageData>({
    queryKey: DbApi.GraphView.makeQueryKey(fileName),
    queryFn: () => DbApi.GraphView.call(fileName),
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
      <DbViewSelector currentView="graph" />
      <Typography variant="h2">
        File: {sourceFile} in {sourceLanguageName}
      </Typography>

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
  const i18nProps = await getI18NextStaticProps({
    locale,
  });

  const queryClient = new QueryClient();

  const fileName = params?.file as string;
  await queryClient.prefetchQuery(DbApi.GraphView.makeQueryKey(fileName), () =>
    DbApi.GraphView.call(fileName)
  );

  return {
    props: { dehydratedState: dehydrate(queryClient), ...i18nProps.props },
  };
};
