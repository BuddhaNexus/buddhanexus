import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { DbSourceBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import { TextView } from "@features/textView/TextView";
import { useTextPage } from "@features/textView/useTextPage";

export default function TextPage() {
  const {
    isError,
    dbLanguage,
    isFallback,
    isFetching,
    hasData,
    allParallels,
    firstItemIndex,
    isFetchingPreviousPage,
    isFetchingNextPage,
    handleFetchingPreviousPage,
    handleFetchingNextPage,
  } = useTextPage();

  if (isError) {
    return <ErrorPage backgroundName={dbLanguage} />;
  }

  if (isFallback) {
    return (
      <PageContainer backgroundName={dbLanguage}>
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={dbLanguage}
      isLoading={isFetching}
      isQueryResultsPage
    >
      <DbViewPageHead />

      {hasData ? (
        <TextView
          data={allParallels}
          firstItemIndex={firstItemIndex}
          isFetchingPreviousPage={isFetchingPreviousPage}
          isFetchingNextPage={isFetchingNextPage}
          onStartReached={handleFetchingPreviousPage}
          onEndReached={handleFetchingNextPage}
        />
      ) : (
        <CenteredProgress />
      )}
      <DbSourceBrowserDrawer />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "settings"])),
  },
});
