import React from "react";
import { LanguageDescription } from "@components/db/LanguageDescription";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useSourceLanguage } from "@components/hooks/useSourceLanguage";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
// import { dehydrate, QueryClient } from "@tanstack/react-query";
// import merge from "lodash/merge";
// import { getLanguageMenuData, getLanguageMenuDataQueryKey } from "utils/api/db";
// import { getI18NextStaticProps } from "utils/common";
// import type { SourceLanguage } from "utils/constants";

export {
  getSourceLanguageStaticPaths as getStaticPaths,
  getI18NextStaticProps as getStaticProps,
} from "utils/common";

export default function DbIndexPage() {
  const { sourceLanguageName, sourceLanguage } = useSourceLanguage();

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h1">{sourceLanguageName}</Typography>

        <SourceTextSearchInput />

        <LanguageDescription lang={sourceLanguage} />
      </Paper>
      <Footer />
    </PageContainer>
  );
}

// export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
//   const sourceLanguage = params?.language as SourceLanguage;
//   const i18nProps = await getI18NextStaticProps({ locale });
//
//   const queryClient = new QueryClient();
//
//   await queryClient.prefetchQuery(
//     getLanguageMenuDataQueryKey(sourceLanguage),
//     () => getLanguageMenuData(sourceLanguage)
//   );
//
//   return merge(
//     { props: { dehydratedState: dehydrate(queryClient) } },
//     i18nProps
//   );
// };
