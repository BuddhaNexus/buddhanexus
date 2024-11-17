import "allotment/dist/style.css";

import React, { useMemo } from "react";
import { LogLevel, Virtuoso } from "react-virtuoso";
import { activeSegmentMatchesAtom } from "@atoms";
import {
  EmptyPlaceholder,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import { useActiveSegmentParam } from "@components/hooks/params";
import { useTextViewRightPane } from "@features/textView/useTextViewRightPane";
import { Paper } from "@mui/material";
import { ParsedTextViewParallels } from "@utils/api/endpoints/text-view/text-parallels";
import { Allotment } from "allotment";
import chroma from "chroma-js";
import { useAtomValue } from "jotai/index";

import { TextSegment } from "./TextSegment";
import TextViewMiddleParallels from "./TextViewMiddleParallels";

interface Props {
  data: ParsedTextViewParallels;
  onEndReached: () => void;
  onStartReached: () => Promise<void>;
  firstItemIndex?: number;
  isFetchingPreviousPage?: boolean;
  isFetchingNextPage?: boolean;
}

// todo: check other elements in segmentText
export const TextView = ({
  data,
  onEndReached,
  onStartReached,
  firstItemIndex,
  isFetchingPreviousPage,
  isFetchingNextPage,
}: Props) => {
  const [activeSegmentId] = useActiveSegmentParam();
  const activeSegmentMatches = useAtomValue(activeSegmentMatchesAtom);

  const colorScale = useMemo(() => {
    const colors = data.map((item) => item.segmentText[0]?.highlightColor ?? 0);
    const [minColor, maxColor] = [Math.min(...colors), Math.max(...colors)];

    return chroma
      .scale("Reds")
      .padding([0.6, 0])
      .domain([maxColor, minColor])
      .correctLightness(true);
  }, [data]);

  const shouldShowMiddlePane =
    activeSegmentId !== "none" && activeSegmentMatches.length > 0;

  const shouldShowRightPane = true;

  // make sure the selected segment is at the top when the page is opened
  const activeSegmentIndexInData = useMemo(() => {
    if (data.length <= 0) return 0;
    const index = data.findIndex(
      (element) => element.segmentNumber === activeSegmentId,
    );
    if (index === -1) return 0;
    return index;
  }, [data, activeSegmentId]);

  const {
    data: rightPaneData,
    isFetchingPreviousPage: isFetchingRightPanePreviousPage,
    isFetchingNextPage: isFetchingRightPaneNextPage,
    error: rightPaneError,
    isSuccess: isRightPaneSuccess,
    fetchPreviousPage: fetchRightPanePreviousPage,
    fetchNextPage: fetchRightPaneNextPage,
    isFetching: isRightPaneFetching,
    isError: isRightPaneError,
    firstItemIndex: rightPaneFirstItemIndex,
  } = useTextViewRightPane(shouldShowRightPane);

  console.log({ rightPaneData, data });

  return (
    <Paper sx={{ flex: 1, py: 1, pl: 2, my: 1 }}>
      <Allotment defaultSizes={[4, 3]}>
        {/* Left pane - text (main view) */}
        <Allotment.Pane>
          <Virtuoso
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={activeSegmentIndexInData}
            data={data.length > 0 ? data : undefined}
            startReached={onStartReached}
            endReached={onEndReached}
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
        </Allotment.Pane>

        {/* Middle pane - parallels for selected segment */}
        <Allotment.Pane visible={shouldShowMiddlePane}>
          <TextViewMiddleParallels />
        </Allotment.Pane>

        {/* Right Pane - shown after a parallel is selected in middle pane */}
        {/* There's some initial rendering issue here, not sure why key prop: */}
        <Allotment.Pane
          key={String(rightPaneData)}
          visible={shouldShowRightPane}
        >
          {/* TODO: plug different data in here */}
          <Virtuoso
            id="2"
            logLevel={LogLevel.DEBUG}
            firstItemIndex={rightPaneFirstItemIndex}
            // initialTopMostItemIndex={activeSegmentIndexInData}
            data={rightPaneData.length > 0 ? rightPaneData : undefined}
            startReached={fetchRightPanePreviousPage}
            endReached={fetchRightPaneNextPage}
            totalCount={rightPaneData.length}
            overscan={900} // pixel value
            increaseViewportBy={500} // solves empty content at start/end of list issue
            initialItemCount={5} // for SSR
            components={{
              Header: isFetchingRightPanePreviousPage
                ? ListLoadingIndicator
                : undefined,
              Footer: isFetchingRightPaneNextPage
                ? ListLoadingIndicator
                : undefined,
              EmptyPlaceholder,
            }}
            itemContent={(_, dataSegment) => (
              <TextSegment data={dataSegment} colorScale={colorScale} />
            )}
          />
        </Allotment.Pane>
      </Allotment>
    </Paper>
  );
};

TextView.displayName = "TextView";
