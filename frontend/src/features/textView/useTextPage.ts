import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStandardViewBaseQueryParams } from "@components/hooks/groupedQueryParams";
import { useActiveSegmentParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSetDbViewFromPath } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { ParsedTextViewParallels } from "@utils/api/endpoints/text-view/text-parallels";
import { DbLanguage } from "@utils/api/types";

type PaginationState = [startEdgePage?: number, endEdgePage?: number];

// arbitrarily high number, as per virtuoso docs
const START_INDEX = 1_000_000;

interface UseTextPageReturn {
  allParallels: ParsedTextViewParallels;
  firstItemIndex: number;
  handleFetchingNextPage: () => void;
  handleFetchingPreviousPage: () => Promise<void>;
  hasData: boolean;
  isError: boolean;
  isFallback: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  dbLanguage: DbLanguage;
  error: Error | null;
}

export function useTextPage(): UseTextPageReturn {
  const { dbLanguage, fileName } = useDbRouterParams();
  const { isFallback } = useSourceFile();

  useSetDbViewFromPath();

  const requestBodyBase = useStandardViewBaseQueryParams();
  const [active_segment] = useActiveSegmentParam();

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const previouslySelectedSegmentsMap = useRef<Record<string, boolean>>({});
  const paginationState = useRef<PaginationState>([0, 0]);

  const hasSegmentBeenSelected = useCallback(
    (segmentId: string): boolean =>
      segmentId !== DEFAULT_PARAM_VALUES.active_segment &&
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
    isFetching,
    isError,
    error,
  } = useInfiniteQuery({
    enabled: Boolean(fileName),
    placeholderData: keepPreviousData,
    initialPageParam: active_segment ? undefined : 0,
    queryKey: DbApi.TextView.makeQueryKey({
      ...requestBodyBase,
      active_segment,
    }),
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
      const activeSegmentParam = hasSegmentBeenSelected(active_segment)
        ? DEFAULT_PARAM_VALUES.active_segment
        : active_segment;

      return DbApi.TextView.call({
        ...requestBodyBase,
        page: pageParam ?? 0,
        active_segment: activeSegmentParam,
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
      if (isSuccess && active_segment)
        previouslySelectedSegmentsMap.current[active_segment] = true;
    },
    [isSuccess, active_segment],
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

  const hasData = Boolean(data);

  return {
    allParallels,
    firstItemIndex,
    handleFetchingNextPage,
    handleFetchingPreviousPage,
    hasData,
    isError,
    isFallback,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    dbLanguage,
    error,
  };
}
