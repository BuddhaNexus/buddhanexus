import React, { useCallback, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  EmptyPlaceholder,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import {
  useActiveSegmentIndexParam,
  useActiveSegmentParam,
  useRightPaneActiveSegmentParam,
} from "@components/hooks/params";
import { CloseTextViewPaneButton } from "@features/textView/CloseTextViewPaneButton";
import { TextSegment } from "@features/textView/TextSegment";
import { useTextViewRightPane } from "@features/textView/useTextViewRightPane";
import { getTextViewColorScale } from "@features/textView/utils";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

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

  const colorScale = useMemo(() => getTextViewColorScale(data), [data]);

  const [, setActiveSegment] = useRightPaneActiveSegmentParam();

  const handleClear = useCallback(async () => {
    await setActiveSegment("none");
  }, [setActiveSegment]);

  // There's some initial rendering issue here, not sure why the key prop is needed but it is:
  return (
    <Card key={String(data)} style={{ height: "100%" }}>
      <CardHeader
        // subheader={
        //   <Typography sx={{ textWrap: "wrap", wordBreak: "break-word" }}>
        //     {activeSegment}
        //   </Typography>
        // }
        action={<CloseTextViewPaneButton handlePress={handleClear} />}
      />
      {/* TODO: plug different data in here */}
      <CardContent style={{ height: "100%" }}>
        <Virtuoso
          firstItemIndex={firstItemIndex}
          // initialTopMostItemIndex={activeSegmentIndexInData}
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
