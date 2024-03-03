import "allotment/dist/style.css";

import React, { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { EmptyPlaceholder, Footer } from "@components/db/ListComponents";
import { Paper } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { Allotment } from "allotment";
import chroma from "chroma-js";
import type { TextPageData } from "types/api/text";
import { useQueryParam } from "use-query-params";

import { TextSegment } from "./TextSegment";
import TextViewMiddleParallels from "./TextViewMiddleParallels";

interface Props {
  data: TextPageData;
  onEndReached: () => void;
  onStartReached: () => void;
}

// todo: check other elements in segmentText
export default function TextView({
  data,
  onEndReached,
  onStartReached,
}: Props) {
  const { mode } = useColorScheme();
  const isDarkTheme = mode === "dark";

  const [selectedSegmentId] = useQueryParam("selectedSegment");

  const colorScale = useMemo(() => {
    const colors = data.map((item) => item.segmentText[0]?.highlightColor ?? 0);
    const [minColor, maxColor] = [Math.min(...colors), Math.max(...colors)];

    return (
      chroma
        .scale("Reds")
        .correctLightness(true)
        .padding(isDarkTheme ? [0, 0.3] : [0.3, 0])
        // small trick to make it readable in both color schemes
        .domain(isDarkTheme ? [minColor, maxColor] : [maxColor, minColor])
    );
  }, [data, isDarkTheme]);

  const hasData = data.length > 0;
  const shouldShowMiddlePane = Boolean(selectedSegmentId);

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
            totalCount={data.length}
            data={hasData ? data : undefined}
            itemContent={(_, dataSegment) => (
              <TextSegment data={dataSegment} colorScale={colorScale} />
            )}
            initialTopMostItemIndex={selectedSegmentIndexInData}
            endReached={onEndReached}
            startReached={onStartReached}
            overscan={20}
            components={{
              Footer: hasData ? Footer : undefined,
              EmptyPlaceholder,
            }}
          />
        </Allotment.Pane>

        {/* Middle pane - parallels for selected segment */}
        <Allotment.Pane visible={shouldShowMiddlePane}>
          <TextViewMiddleParallels />
        </Allotment.Pane>
      </Allotment>
    </Paper>
  );
}
