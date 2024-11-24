import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import LoadingSpinner from "@components/common/LoadingSpinner";
import {
  EmptyPlaceholder,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import { useRightPaneActiveSegmentParam } from "@components/hooks/params";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { CloseTextViewPaneButton } from "@features/textView/CloseTextViewPaneButton";
import { TextSegment } from "@features/textView/TextSegment";
import { useTextViewRightPane } from "@features/textView/useTextViewRightPane";
import {
  findSegmentIndexInData,
  getTextViewColorScale,
} from "@features/textView/utils";
import { Box, Card, CardContent } from "@mui/material";

export const TextViewRightPane = () => {
  const {
    data,
    isFetchingPreviousPage,
    isFetchingNextPage,
    error,
    isSuccess,
    fetchPreviousPage,
    fetchNextPage,
    isFetching,
    isError,
    firstItemIndex,
  } = useTextViewRightPane();

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const colorScale = useMemo(() => getTextViewColorScale(data), [data]);

  const [activeSegmentId, setActiveSegment] = useRightPaneActiveSegmentParam();

  const handleClear = useCallback(async () => {
    await setActiveSegment("none");
  }, [setActiveSegment]);

  // make sure the selected segment is at the top when the page is opened
  const activeSegmentIndexInData = useMemo(
    () => findSegmentIndexInData(data, activeSegmentId),
    [data, activeSegmentId],
  );

  useLayoutEffect(() => {
    if (!activeSegmentId) return;
    const indexInData = findSegmentIndexInData(data, activeSegmentId);
    // console.log("scrolling to index:", indexInData);
    // console.log({ activeSegmentId });
    virtuosoRef.current?.scrollToIndex(indexInData);
  }, [activeSegmentId, data]);

  // There's some initial rendering issue here, not sure why the key prop is needed, but it is:
  return (
    <Card key={String(data)} style={{ height: "100%" }}>
      <Box sx={{ position: "absolute", p: 1.5, right: 0, zIndex: 10 }}>
        <CloseTextViewPaneButton handlePress={handleClear} />{" "}
      </Box>
      {/* TODO: plug different data in here */}
      <CardContent style={{ height: "100%" }}>
        {isFetching && <LoadingSpinner />}
        <Virtuoso
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={activeSegmentIndexInData}
          data={data.length > 0 ? data : undefined}
          startReached={fetchPreviousPage}
          endReached={fetchNextPage}
          totalCount={data.length}
          overscan={900} // pixel value
          increaseViewportBy={500} // solves empty content at start/end of list issue
          initialItemCount={5} // for SSR
          components={{
            Header: isFetchingPreviousPage ? ListLoadingIndicator : undefined,
            Footer: isFetchingNextPage ? ListLoadingIndicator : undefined,
            EmptyPlaceholder,
          }}
          itemContent={(_, dataSegment) => (
            <TextSegment data={dataSegment} colorScale={colorScale} />
          )}
        />
      </CardContent>
    </Card>
  );
};
