import React, { useMemo } from "react";
import type { GetStaticProps } from "next";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbView } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { prefetchSourceTextBrowserData } from "features/sourceTextBrowserDrawer/apiQueryUtils";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import TextView from "features/textView/TextView";
import merge from "lodash/merge";
import type { PagedResponse } from "types/api/common";
import type { TextPageData } from "types/api/text";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getDbViewFileStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

/**
 * TODO
 * 1. Display text on left side
 * 2. Allow selection
 * 3. Grab parallels for middle (https://buddhanexus2.kc-tbts.uni-hamburg.de/api/text-view/middle)
 * 4. Display using table view components
 * ?: use /text-view/text-parallels/
 * * Split pane: use https://github.com/johnwalley/allotment
 *
 * @constructor
 */
export default function TextPage() {
  const { sourceLanguage, fileName, queryParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  useDbView();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedSegment, ...paramsThatShouldRefreshText } = queryParams;

  const { data, fetchNextPage, fetchPreviousPage, isInitialLoading, isError } =
    useInfiniteQuery<PagedResponse<TextPageData>>({
      queryKey: DbApi.TextView.makeQueryKey({
        fileName,
        queryParams: paramsThatShouldRefreshText,
      }),
      queryFn: ({ pageParam = 0 }) =>
        DbApi.TextView.call({
          fileName,
          queryParams,
          pageNumber: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0 ? undefined : lastPage.pageNumber - 1,
      refetchOnWindowFocus: false,
    });

  const allData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data) : []),
    [data]
  );

  if (isError) {
    return <ErrorPage backgroundName={sourceLanguage} />;
  }

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      hasSidebar={true}
    >
      <DbViewPageHead />

      {isInitialLoading || !data ? (
        <CenteredProgress />
      ) : (
        <TextView
          data={allData}
          onEndReached={fetchNextPage}
          onStartReached={fetchPreviousPage}
        />
      )}

      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18nProps = await getI18NextStaticProps({ locale }, ["settings"]);

  const queryClient = await prefetchSourceTextBrowserData(
    params?.language as SourceLanguage
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps
  );
};
