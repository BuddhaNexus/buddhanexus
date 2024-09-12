import "allotment/dist/style.css";

import React, { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  EmptyPlaceholder,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import { Paper } from "@mui/material";
import { Allotment } from "allotment";
import chroma from "chroma-js";
import { selectedSegmentMatchesAtom } from "features/atoms/textView";
import { useAtomValue } from "jotai/index";
import { useQueryParam } from "use-query-params";
import { ParsedTextViewParallels } from "utils/api/endpoints/text-view/text-parallels";

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
  const [selectedSegmentId] = useQueryParam("selectedSegment");
  const selectedSegmentMatches = useAtomValue(selectedSegmentMatchesAtom);

  const colorScale = useMemo(() => {
    const colors = data.map((item) => item.segmentText[0]?.highlightColor ?? 0);
    const [minColor, maxColor] = [Math.min(...colors), Math.max(...colors)];

    return chroma
      .scale("Reds")
      .padding([0.6, 0])
      .domain([maxColor, minColor])
      .correctLightness(true);
  }, [data]);

  const hasData = data.length > 0;
  const shouldShowMiddlePane =
    Boolean(selectedSegmentId) && selectedSegmentMatches.length > 0;

  // make sure the selected segment is at the top when the page is opened
  const selectedSegmentIndexInData = useMemo(() => {
    if (!hasData) return 0;
    const index = data.findIndex(
      (element) => element.segmentNumber === selectedSegmentId,
    );
    if (index === -1) return 0;
    return index;
  }, [data, hasData, selectedSegmentId]);

  return (
    <Paper sx={{ flex: 1, py: 1, pl: 2, my: 1 }}>
      <Allotment defaultSizes={[4, 3]}>
        {/* Left pane - text (main view) */}
        <Allotment.Pane>
          <Virtuoso
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={selectedSegmentIndexInData}
            data={hasData && data.length > 0 ? data : undefined}
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
      </Allotment>
    </Paper>
  );
};

TextView.displayName = "TextView";
