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
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { TextSegment } from "@features/textView/TextSegment";
import { useTextPagePane } from "@features/textView/useTextPagePane";
import {
  findSegmentIndexInParallelsData,
  getTextViewColorScale,
} from "@features/textView/utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface TextViewPaneProps {
  activeSegmentId: string;
  fileName: string;
}

export const TextViewPane = ({
  activeSegmentId,
  fileName,
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
  } = useTextPagePane({ fileName, activeSegment: activeSegmentId });

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

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent style={{ height: "100%" }}>
        <Virtuoso
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
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
