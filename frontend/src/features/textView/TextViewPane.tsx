import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
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
}: {
  isRightPane: boolean;
} & TextViewPaneProps) => {
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

  // make sure the selected segment is at the top when the page is opened
  useEffect(
    function scrollToActiveSegment() {
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

      requestAnimationFrame(() => {
        virtuosoRef.current?.scrollToIndex({
          index: findSegmentIndexInParallelsData(allParallels, activeSegmentId),
          align: "center",
        });
      });
    },
    [activeSegmentId, allParallels],
  );

  return (
    <Card sx={{ height: "100%" }}>
      <Box sx={{ height: "100%", py: 0, px: 2 }}>
        <Virtuoso
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          increaseViewportBy={500}
          startReached={async () => {
            wasDataJustAppended.current = true;
            await handleFetchingPreviousPage();
          }}
          endReached={async () => {
            wasDataJustAppended.current = true;
            await handleFetchingNextPage();
          }}
          skipAnimationFrameInResizeObserver={true}
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
            />
          )}
          data={allParallels}
        />
      </Box>
    </Card>
  );
};
