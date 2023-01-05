import React from "react";
import type { GetStaticProps } from "next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LanguageDescription } from "@components/db/LanguageDescription";
// import { SourceTextBrowserTree } from "@components/db/SourceTextBrowserTree";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import merge from "lodash/merge";
// import { getSourceTextCollectionsQueryKey } from "utils/api/db";
import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceLanguageStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function DbIndexPage() {
  const { sourceLanguageName, sourceLanguage } = useDbQueryParams();

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h1">{sourceLanguageName}</Typography>

        <SourceTextSearchInput />

        {/* <SourceTextBrowserTree />*/}

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
    ["dbChn", "dbPli", "dbSkt", "dbTib"]
  );

  const queryClient = new QueryClient();

  // TODO: use for SourceTextBrowserTree
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sourceLanguage = params?.language as SourceLanguage;
  // await queryClient.prefetchQuery(
  //   getSourceTextCollectionsQueryKey(sourceLanguage),
  //   () => getSourceTextCollections(sourceLanguage)
  // );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps
  );
};
