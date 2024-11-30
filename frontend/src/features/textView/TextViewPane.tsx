import React, {
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  // useState,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import LoadingSpinner, {
  InfiniteLoadingSpinner,
} from "@components/common/LoadingSpinner";
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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface TextViewPaneProps {
  activeSegmentId: string;
  isRightPane: boolean;
}

export const TextViewPane = ({
  activeSegmentId,
  isRightPane,
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
  } = useTextViewPane({ activeSegment: activeSegmentId });

  // const [isScrollingToActiveSegment, setIsScrollingToActiveSegment] = useState(
  //   activeSegmentId !== DEFAULT_PARAM_VALUES.active_segment,
  // );

  const colorScale = useMemo(
    () => getTextViewColorScale(allParallels),
    [allParallels],
  );

  // make sure the selected segment is at the top when the page is opened
  useLayoutEffect(() => {
    if (
      !activeSegmentId ||
      activeSegmentId === DEFAULT_PARAM_VALUES.active_segment
    )
      return;

    // prevent layout jump when data is updated (e.g. during pagination/endless loading)
    if (wasDataJustAppended.current) {
      wasDataJustAppended.current = false;
      return;
    }

    // setIsScrollingToActiveSegment(true);

    const indexInData = findSegmentIndexInParallelsData(
      allParallels,
      activeSegmentId,
    );
    setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: indexInData,
        align: "center",
      });
      // setIsScrollingToActiveSegment(false);
    }, 200);
  }, [activeSegmentId, allParallels]);

  // const indexInData = findSegmentIndexInParallelsData(
  //   allParallels,
  //   activeSegmentId,
  // );

  const isFetchingExtraPages = isFetchingNextPage || isFetchingPreviousPage;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        {/*{isFetchingExtraPages || isScrollingToActiveSegment ? (*/}
        {isFetchingExtraPages ? <LoadingSpinner isLoading={true} /> : null}
        <Virtuoso
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          // initialTopMostItemIndex={indexInData}
          data={allParallels}
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
              onClickFunction={isRightPane ? "" : "open-matches"}
            />
          )}
        />
      </CardContent>
    </Card>
  );
};
