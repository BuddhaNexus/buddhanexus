import React, {
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import LoadingSpinner from "@components/common/LoadingSpinner";
import {
  EmptyPlaceholder,
  ListDivider,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import { useActiveSegmentParam } from "@components/hooks/params";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { TextSegment } from "@features/textView/TextSegment";
import { useTextPageLeftPane } from "@features/textView/useTextPageLeftPane";
import {
  findSegmentIndexInParallelsData,
  getTextViewColorScale,
} from "@features/textView/utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const TextViewLeftPane = () => {
  const [activeSegmentId] = useActiveSegmentParam();

  const wasDataJustAppended: MutableRefObject<boolean> = useRef(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const {
    isError,
    error,
    isFetching,
    hasData,
    allParallels,
    firstItemIndex,
    isFetchingPreviousPage,
    isFetchingNextPage,
    handleFetchingPreviousPage,
    handleFetchingNextPage,
  } = useTextPageLeftPane();

  const colorScale = useMemo(
    () => getTextViewColorScale(allParallels),
    [allParallels],
  );

  // const activeSegmentIndexInData = useMemo(
  //   () => findSegmentIndexInParallelsData(allParallels, activeSegmentId),
  //   [allParallels, activeSegmentId],
  // );

  // console.log({ activeSegmentIndexInData });

  // make sure the selected segment is at the top when the page is opened
  useLayoutEffect(() => {
    if (
      !activeSegmentId ||
      activeSegmentId === DEFAULT_PARAM_VALUES.active_segment
    )
      return;

    // prevent layout jump when data is updated
    if (wasDataJustAppended.current) {
      wasDataJustAppended.current = false;
      return;
    }

    const indexInData = findSegmentIndexInParallelsData(
      allParallels,
      activeSegmentId,
    );
    virtuosoRef.current?.scrollToIndex({
      index: indexInData,
      align: "center",
    });
  }, [activeSegmentId, allParallels]);

  console.log({ firstItemIndex });

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent style={{ height: "100%" }}>
        <Virtuoso
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          // initialTopMostItemIndex={activeSegmentIndexInData}
          data={allParallels}
          startReached={async () => {
            wasDataJustAppended.current = true;
            await handleFetchingPreviousPage();
          }}
          style={{ height: "100%" }}
          endReached={async () => {
            wasDataJustAppended.current = true;
            await handleFetchingNextPage();
          }}
          // totalCount={allParallels.length}
          components={{
            Header: isFetchingPreviousPage ? ListLoadingIndicator : ListDivider,
            Footer: isFetchingNextPage ? ListLoadingIndicator : ListDivider,
            EmptyPlaceholder: isFetching ? LoadingSpinner : EmptyPlaceholder,
          }}
          itemContent={(_, dataSegment) => (
            <TextSegment data={dataSegment} colorScale={colorScale} />
          )}
        />
      </CardContent>
    </Card>
  );
};
