import React, { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  EmptyPlaceholder,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import { useActiveSegmentParam } from "@components/hooks/params";
import { TextSegment } from "@features/textView/TextSegment";
import { TextViewProps } from "@features/textView/TextView";
import {
  findSegmentIndexInData,
  getTextViewColorScale,
} from "@features/textView/utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const TextViewLeftPane = ({
  data,
  firstItemIndex,
  isFetchingPreviousPage,
  isFetchingNextPage,
  onStartReached,
  onEndReached,
}: TextViewProps) => {
  const [activeSegmentId] = useActiveSegmentParam();

  const colorScale = useMemo(() => getTextViewColorScale(data), [data]);

  // make sure the selected segment is at the top when the page is opened
  const activeSegmentIndexInData = useMemo(
    () => findSegmentIndexInData(data, activeSegmentId),
    [data, activeSegmentId],
  );

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent style={{ height: "100%" }}>
        <Virtuoso
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={activeSegmentIndexInData}
          data={data.length > 0 ? data : undefined}
          startReached={onStartReached}
          style={{ height: "100%" }}
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
      </CardContent>
    </Card>
  );
};
