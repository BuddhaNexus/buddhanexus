import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InfiniteLoadingSpinner } from "@components/common/LoadingSpinner";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { PageContainer } from "@components/layout/PageContainer";
import { VisualView } from "@features/visualView/VisualView";

export default function VisualPage() {
  const { isFallback } = useDbPageRouterParams();

  return (
    <PageContainer maxWidth="xl">
      {isFallback ? <InfiniteLoadingSpinner /> : <VisualView />}
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "settings"])),
  },
});
