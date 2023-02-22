import type { GetStaticProps } from "next";
import { DbResultsPageHead } from "@components/db/DbResultsPageHead";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress, Typography } from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { ApiGraphPageData } from "types/api/common";
import { DbApi } from "utils/api/dbApi";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceTextStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function TextPage() {
  const { sourceLanguage, fileName, serializedParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();

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
      <DbResultsPageHead currentView="text" />

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
    ["settings"]
  );

  const queryClient = new QueryClient();

  const fileName = params?.file as string;
  await queryClient.prefetchQuery(DbApi.GraphView.makeQueryKey(fileName), () =>
    DbApi.GraphView.call(fileName, `?co_occ=2000`)
  );

  return {
    props: { dehydratedState: dehydrate(queryClient), ...i18nProps.props },
  };
};
