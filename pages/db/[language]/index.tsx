import React from "react";
import type { GetStaticProps } from "next";
import { LanguageDescription } from "@components/db/LanguageDescription";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useAvailableDbViews } from "@components/hooks/useDbView";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";
import { currentViewAtom } from "features/atoms";
import { DbViewEnum } from "features/sidebarSuite/config/types";
// import { dehydrate } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import { useAtom } from "jotai";
import merge from "lodash/merge";
// import { prefetchDefaultDbPageData } from "utils/api/apiQueryUtils";
// import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getSourceLanguageStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function DbIndexPage() {
  const { sourceLanguageName, sourceLanguage } = useDbQueryParams();
  const availableViews = useAvailableDbViews();
  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  React.useEffect(() => {
    if (!availableViews.includes(currentView)) {
      setCurrentView(DbViewEnum.TEXT);
    }
  }, [availableViews, currentView, setCurrentView]);

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

export const getStaticProps: GetStaticProps = async ({
  locale,
  // params
}) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["db", "settings"],
  );

  // const queryClient = await prefetchDefaultDbPageData(
  //   params?.language as SourceLanguage,
  // );

  return merge(
    // { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
