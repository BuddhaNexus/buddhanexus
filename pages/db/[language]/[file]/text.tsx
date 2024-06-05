import React, { useMemo } from "react";
import type { GetStaticProps } from "next";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbView } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper } from "@mui/material";
import { dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import TextView from "features/textView/TextView";
import merge from "lodash/merge";
import { prefetchDbResultsPageData } from "utils/api/apiQueryUtils";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";
export { getDbViewFileStaticPaths as getStaticPaths } from "utils/nextJsHelpers";
import { textViewFilterComparisonAtom } from "features/atoms";
import { useAtom } from "jotai";
import { NumberParam, StringParam, useQueryParam } from "use-query-params";
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

const Loading = () => (
  <Paper
    sx={{
      display: "flex",
      alignItems: "center",
      flex: 1,
      width: "100%",
      height: "100dvh",
      py: 1,
      pl: 2,
      my: 1,
    }}
  >
    <CenteredProgress />
  </Paper>
);

export default function TextPage() {
  const { sourceLanguage, fileName, queryParams, defaultQueryParams } =
    useDbQueryParams();
  const { isFallback } = useSourceFile();

  useDbView();

  const [selectedSegment, setSelectedSegment] = useQueryParam(
    "selectedSegment",
    StringParam,
  );

  const [, setSelectedSegmentIndex] = useQueryParam(
    "selectedSegmentIndex",
    NumberParam,
  );

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedSegment: popId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedSegmentIndex: popIndex,
    ...paramsThatShouldRefreshText
  } = queryParams;

  const [textViewFilterComparison, setTextViewFilterComparison] = useAtom(
    textViewFilterComparisonAtom,
  );

  // Clears TextViewMiddleParallels on queryParams change to avoid rendering non-existing parallel matches on new params. Run before data query to prevent content flashing.
  React.useEffect(() => {
    const paramString = JSON.stringify(paramsThatShouldRefreshText);

    if (
      !selectedSegment ||
      paramString === textViewFilterComparison ||
      (!textViewFilterComparison && paramString.length > 0)
    ) {
      setTextViewFilterComparison(paramString);
    } else {
      setSelectedSegment(undefined);
      setSelectedSegmentIndex(undefined);
      setTextViewFilterComparison(paramString);
    }
  }, [
    selectedSegment,
    setSelectedSegment,
    setSelectedSegmentIndex,
    paramsThatShouldRefreshText,
    textViewFilterComparison,
    setTextViewFilterComparison,
  ]);

  const { data, fetchNextPage, fetchPreviousPage, isLoading, isError } =
    useInfiniteQuery({
      initialPageParam: 0,
      queryKey: DbApi.TextView.makeQueryKey({
        file_name: fileName,
        ...paramsThatShouldRefreshText,
      }),
      queryFn: ({ pageParam }) =>
        DbApi.TextView.call({
          file_name: fileName,
          ...defaultQueryParams,
          ...queryParams,
          page_number: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0 ? undefined : lastPage.pageNumber - 1,
    });

  const allData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data) : []),
    [data],
  );

  if (isError) {
    return <ErrorPage backgroundName={sourceLanguage} />;
  }

  if (isFallback) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      isQueryResultsPage
    >
      <DbViewPageHead />

      {isLoading ? (
        <Loading />
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
  const i18nProps = await getI18NextStaticProps({ locale }, [
    "common",
    "settings",
  ]);

  const queryClient = await prefetchDbResultsPageData(
    params?.language as SourceLanguage,
    params?.file as string,
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
