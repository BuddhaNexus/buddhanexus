import React from "react";
import type { GetStaticProps } from "next";
import { LanguageDescription } from "@components/db/LanguageDescription";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import merge from "lodash/merge";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceLanguageStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function DbIndexPage() {
  const { sourceLanguageName, sourceLanguage } = useDbQueryParams();

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <SourceTextBrowserDrawer />

      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h1">{sourceLanguageName}</Typography>

        <SourceTextSearchInput />

        <LanguageDescription lang={sourceLanguage} />
      </Paper>
      <Footer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["db"]
  );

  const queryClient = new QueryClient({
    // https://www.codemzy.com/blog/react-query-cachetime-staletime
    defaultOptions: {
      queries: {
        // 1 hour
        staleTime: 60 * 60 * 1000,

        // 2 days
        cacheTime: 2 * 24 * 60 * 60 * 1000,
      },
    },
  });

  // TODO: use for SourceTextBrowserTree
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sourceLanguage = params?.language as SourceLanguage;
  await queryClient.prefetchQuery(
    DbApi.SegmentsData.makeQueryKey(sourceLanguage),
    () => DbApi.SidebarSourceTexts.call(sourceLanguage)
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps
  );
};
