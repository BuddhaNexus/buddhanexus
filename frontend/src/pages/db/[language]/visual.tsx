import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { VisualView } from "@features/visualView/VisualView";

export default function VisualPage() {
  const { isFallback } = useDbRouterParams();

  return (
    <PageContainer maxWidth="xl">
      {isFallback ? <CenteredProgress /> : <VisualView />}
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "settings"])),
  },
});
