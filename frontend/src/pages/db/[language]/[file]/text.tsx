import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GetServerSideProps } from "next";
// import type { GetStaticProps } from "next";
import { useSearchParams } from "next/navigation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSetDbViewFromPath } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { DbSourceBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import { TextView } from "@features/textView/TextView";
// import { dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
// import { prefetchDbResultsPageData } from "@utils/api/apiQueryUtils";
import { DbApi } from "@utils/api/dbApi";
// import type { SourceLanguage } from "@utils/constants";
// import { getI18NextStaticProps } from "@utils/nextJsHelpers";
// import merge from "lodash/merge";

// export { getDbViewFileStaticPaths as getStaticPaths } from "@utils/nextJsHelpers";

type QueryParams = Record<string, string>;

const cleanUpQueryParams = (queryParams: QueryParams): QueryParams => {
  const {
    // changing these properties (by selecting the segments)
    // should not reload the page.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedSegment,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedSegmentIndex,
    ...apiQueryParams
  } = queryParams;
  return apiQueryParams;
};

// arbitrarily high number, as per virtuoso docs
const START_INDEX = 1_000_000;

// open bugs:
// 1. Selecting a segment reloads the page
//   - it's caused by the queryKey param changing. Connected to issue 2
// 2. On the first page load, the `selectedSegment` search param is not defined.
//   - experiment with suspense and async components to fix it
//   - migrating to the app router may also solve it
//   - https://github.com/vercel/next.js/issues/53543

export default function TextPage() {
  const { sourceLanguage, fileName, queryParams, defaultQueryParams } =
    useDbQueryParams();
  const { isFallback } = useSourceFile();

  useSetDbViewFromPath();

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const previouslySelectedSegmentsMap = useRef<Record<string, boolean>>({});

  const paginationState = useRef<
    [startEdgePage?: number, endEdgePage?: number]
  >([0, 0]);

  const searchParams = useSearchParams();
  const selectedSegment = searchParams.get("selectedSegment");

  const apiQueryParams = cleanUpQueryParams(queryParams);

  const hasSegmentBeenSelected = useCallback(
    (segmentId: string | null): boolean =>
      segmentId !== null &&
      Boolean(previouslySelectedSegmentsMap.current[segmentId]),
    [],
  );

  const {
    data,
    isSuccess,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
  } = useInfiniteQuery({
    enabled: Boolean(fileName),
    initialPageParam: selectedSegment ? undefined : 0,
    queryKey: DbApi.TextView.makeQueryKey(
      { file_name: fileName, ...apiQueryParams },
      selectedSegment ?? undefined,
    ),
    queryFn: ({ pageParam }) => {
      // We pass the active_segment, but only on the first page load :/
      //
      // This is a bit of a workaround to enable scrolling up. Explanation:
      // When `active_segment` is inside a query param, the BE always responds with the page that includes the segment.
      // We pass it to the backend, and we assume the page is 0. In the BE response, it tells us that we're on page 1,
      // but there's no way to request page 0 when `active_segment` is included.
      //
      // A possible issue with this workaround is that it only runs on the client side.
      // We may need to revisit after moving to the Next.js App Router

      // if the `active_segment` param was already sent for this segment,
      // don't send it anymore.
      const active_segment = hasSegmentBeenSelected(selectedSegment)
        ? undefined
        : selectedSegment;

      return DbApi.TextView.call({
        file_name: fileName,
        ...defaultQueryParams,
        ...apiQueryParams,
        page_number: pageParam,
        active_segment: active_segment ?? undefined,
      });
    },

    getPreviousPageParam: () => {
      // if it's the first page, don't fetch more
      const [startEdge] = paginationState.current;
      if (startEdge === undefined || startEdge === 0) return undefined;
      return startEdge - 1;
    },

    getNextPageParam: (lastPage) => {
      const [, endEdge] = paginationState.current;
      if (endEdge === undefined || endEdge === lastPage.data.totalPages - 1) {
        // last page, as indicated by the BE response
        return undefined;
      }
      return endEdge + 1;
    },
  });

  // see queryFn comment above
  useEffect(
    function updatePreviouslySelectedSegmentsMap() {
      if (isSuccess && selectedSegment)
        previouslySelectedSegmentsMap.current[selectedSegment] = true;
    },
    [isSuccess, selectedSegment],
  );

  useEffect(
    function handleApiResponse() {
      if (!data?.pages[0]) {
        return;
      }
      const currentPageCount = data?.pages?.length;
      // when the first page is loaded, set the current page number to the one received from the BE
      if (currentPageCount === 1) {
        paginationState.current[0] = data?.pages[0].data.page;
        paginationState.current[1] = data?.pages[0].data.page;
      }
    },
    [data?.pages],
  );

  const handleFetchingPreviousPage = useCallback(async () => {
    // already on first page
    if (paginationState.current[0] === 0) return;

    const { data: responseData } = await fetchPreviousPage();
    // eslint-disable-next-line require-atomic-updates
    paginationState.current[0] = responseData?.pages[0]?.data.page;

    const fetchedPageSize = responseData?.pages[0]?.data.items?.length;
    if (!fetchedPageSize) return;

    // the user is scrolling up.
    // offset the new list items when prepending them to the page.
    setFirstItemIndex((prevIndex) => prevIndex - fetchedPageSize);
  }, [fetchPreviousPage]);

  const handleFetchingNextPage = useCallback(async () => {
    const response = await fetchNextPage();
    paginationState.current[1] = response.data?.pages.at(-1)?.data.page;
  }, [fetchNextPage]);

  const allParallels = useMemo(
    () => (data?.pages ? data.pages.flatMap((page) => page.data.items) : []),
    [data?.pages],
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
      isLoading={isLoading || isFetching}
      isQueryResultsPage
    >
      <DbViewPageHead />

      {data ? (
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

// export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
//   const i18nProps = await getI18NextStaticProps({ locale }, [
//     "common",
//     "settings",
//   ]);
//
//   const queryClient = await prefetchDbResultsPageData(
//     params?.language as SourceLanguage,
//     params?.file as string,
//   );
//
//   return merge(
//     { props: { dehydratedState: dehydrate(queryClient) } },
//     i18nProps,
//   );
// };
