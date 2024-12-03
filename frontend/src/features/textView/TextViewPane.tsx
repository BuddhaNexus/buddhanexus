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

export interface TextViewPaneProps {
  isRightPane: boolean;
  activeSegmentId: string;
  setActiveSegmentId: (id: string) => Promise<URLSearchParams>;
  activeSegmentIndex: number | null;
  setActiveSegmentIndex: (index: number) => Promise<URLSearchParams>;
}

export const TextViewPane = ({
  isRightPane,
  activeSegmentId,
  setActiveSegmentId,
  activeSegmentIndex,
  setActiveSegmentIndex,
}: TextViewPaneProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const wasDataJustAppended: MutableRefObject<boolean> = useRef(false);

  // const hasTextMounted = useRef(false);
  //
  // useEffect(function setTextMounted() {
  //   const timeout = setTimeout(() => {
  //     hasTextMounted.current = true;
  //   }, 2000);
  //   return () => clearTimeout(timeout);
  // }, []);

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
      if (wasDataJustAppended.current) {
        wasDataJustAppended.current = false;
        return;
      }

      scrollToActiveSegment();

      // setTimeout(() => {}, 1000);
    },
    [activeSegmentId, allParallels, scrollToActiveSegment],
  );

  const handleStartReached = useCallback(async () => {
    // if (!hasTextMounted.current) return;
    wasDataJustAppended.current = true;
    await handleFetchingPreviousPage();
  }, [handleFetchingPreviousPage]);

  const handleEndReached = useCallback(async () => {
    // if (!hasTextMounted.current) return;
    wasDataJustAppended.current = true;
    await handleFetchingNextPage();
  }, [handleFetchingNextPage]);

  return (
    <Card sx={{ height: "100%" }}>
      <Box sx={{ height: "100%", py: 0, px: 2 }}>
        <Virtuoso
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          increaseViewportBy={1000}
          startReached={handleStartReached}
          endReached={handleEndReached}
          components={{
            Header: isFetchingPreviousPage ? ListLoadingIndicator : ListDivider,
            Footer: isFetchingNextPage ? ListLoadingIndicator : ListDivider,
            EmptyPlaceholder: isFetching
              ? InfiniteLoadingSpinner
              : EmptyPlaceholder,
          }}
          itemContent={(_, dataSegment) => (
            <TextSegment
              data={dataSegment}
              colorScale={colorScale}
              activeSegmentId={activeSegmentId}
              setActiveSegmentId={setActiveSegmentId}
              activeSegmentIndex={activeSegmentIndex}
              setActiveSegmentIndex={setActiveSegmentIndex}
              isRightPane={isRightPane}
            />
          )}
          data={allParallels}
          onResizeCapture={scrollToActiveSegment}
        />
      </Box>
    </Card>
  );
};
