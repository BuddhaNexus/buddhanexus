import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { InfiniteLoadingSpinner } from "@components/common/LoadingSpinner";
import {
  EmptyPlaceholder,
  ListDivider,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { TextSegment } from "@features/textView/TextSegment";
import { useTextViewPane } from "@features/textView/useTextViewPane";
import {
  findSegmentIndexInParallelsData,
  getTextViewColorScale,
} from "@features/textView/utils";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import { ParsedTextViewParallel } from "@utils/api/endpoints/text-view/text-parallels";
import debounce from "lodash/debounce";

export interface TextViewPaneProps {
  isRightPane: boolean;
  activeSegmentId: string;
  setActiveSegmentId: (id: string) => Promise<URLSearchParams>;
  activeSegmentIndex: number | null;
  setActiveSegmentIndex: (index: number) => Promise<URLSearchParams>;
}

const debounceEdgeReachedFunction =
  (callback: () => Promise<void>) => async (isReached: boolean) => {
    if (!isReached) return;
    const debouncedEdgeReachedFunction = debounce(
      async () => await callback(),
      1000,
      { leading: true },
    );
    await debouncedEdgeReachedFunction();
  };

export const TextViewPane = ({
  isRightPane,
  activeSegmentId,
  setActiveSegmentId,
  activeSegmentIndex,
  setActiveSegmentIndex,
}: TextViewPaneProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const wasDataJustAppended: MutableRefObject<boolean> = useRef(false);

  const {
    // [TODO] add error handling
    // isError,
    // error,
    // hasData,
    isFetching,
    allParallels,
    firstItemIndex,
    isFetchingPreviousPage,
    isFetchingNextPage,
    handleFetchingPreviousPage,
    handleFetchingNextPage,
  } = useTextViewPane({ activeSegment: activeSegmentId, isRightPane });

  const colorScale = useMemo(
    () => getTextViewColorScale(allParallels),
    [allParallels],
  );

  const scrollToActiveSegment = useCallback(() => {
    const index = findSegmentIndexInParallelsData(
      allParallels,
      activeSegmentId,
    );
    if (index === 0) return;
    virtuosoRef.current?.scrollToIndex({ index, align: "center" });
  }, [activeSegmentId, allParallels]);

  // make sure the selected segment is at the top when the page is opened
  useEffect(
    function scrollToActiveSegmentOnMount() {
      // don't scroll if there is no active segment selected
      if (
        !activeSegmentId ||
        activeSegmentId === DEFAULT_PARAM_VALUES.active_segment
      ) {
        return;
      }

      // prevent layout jump when data is updated (e.g. during pagination/endless loading)
      // fix: causes a bug - sometimes the segment is not scrolled to
      if (wasDataJustAppended.current) {
        return;
      }

      scrollToActiveSegment();

      // workaround/hack for the bug described above. It doesn't fully fix the problem though.
      setTimeout(() => scrollToActiveSegment(), 1000);
    },
    [activeSegmentId, scrollToActiveSegment],
  );

  const handleStartReached = useCallback(async () => {
    wasDataJustAppended.current = true;
    await handleFetchingPreviousPage();
    // fixes issue with scrolling to segment automatically on endless scrolling
    setTimeout(() => (wasDataJustAppended.current = false));
  }, [handleFetchingPreviousPage]);

  const handleBottomReached = useCallback(async () => {
    wasDataJustAppended.current = true;
    await handleFetchingNextPage();
    // fixes issue with scrolling to segment automatically on endless scrolling
    setTimeout(() => (wasDataJustAppended.current = false));
  }, [handleFetchingNextPage]);

  const itemContent = useCallback(
    (index: number, dataSegment: ParsedTextViewParallel) => (
      <TextSegment
        data={dataSegment}
        colorScale={colorScale}
        activeSegmentId={activeSegmentId}
        setActiveSegmentId={setActiveSegmentId}
        activeSegmentIndex={activeSegmentIndex}
        setActiveSegmentIndex={setActiveSegmentIndex}
        isRightPane={isRightPane}
      />
    ),
    [
      activeSegmentId,
      activeSegmentIndex,
      colorScale,
      isRightPane,
      setActiveSegmentId,
      setActiveSegmentIndex,
    ],
  );

  return (
    <Card sx={{ height: "100%" }}>
      <Box sx={{ height: "100%", py: 0, px: 2 }}>
        <Virtuoso<ParsedTextViewParallel>
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          increaseViewportBy={1000}
          skipAnimationFrameInResizeObserver={true}
          components={{
            Header: isFetchingPreviousPage ? ListLoadingIndicator : ListDivider,
            Footer: isFetchingNextPage ? ListLoadingIndicator : ListDivider,
            EmptyPlaceholder: isFetching
              ? InfiniteLoadingSpinner
              : EmptyPlaceholder,
          }}
          itemContent={itemContent}
          data={allParallels}
          atTopStateChange={debounceEdgeReachedFunction(handleStartReached)}
          atBottomStateChange={debounceEdgeReachedFunction(handleBottomReached)}
        />
      </Box>
    </Card>
  );
};
