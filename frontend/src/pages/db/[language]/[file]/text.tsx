import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { DbSourceBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import { TextView } from "@features/textView/TextView";

export default function TextPage() {
  const { dbLanguage, isFallback } = useDbRouterParams();

  if (isFallback) {
    return (
      <PageContainer
        maxWidth="xl"
        backgroundName={dbLanguage}
        isQueryResultsPage
      >
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" backgroundName={dbLanguage} isQueryResultsPage>
      <TextView />
      <DbSourceBrowserDrawer />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "settings"])),
  },
});
