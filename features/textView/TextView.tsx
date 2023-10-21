import "allotment/dist/style.css";

import React, { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { useTheme } from "next-themes";
import { Paper, Typography } from "@mui/material";
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

const Footer = () => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography>Loading...</Typography>
    </div>
  );
};

// todo: check other elements in segmentText
export default function TextView({
  data,
  onEndReached,
  onStartReached,
}: Props) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const [
    selectedSegmentId,
    // setSelectedSegmentId
  ] = useQueryParam("selectedSegment");

  const colorScale = useMemo(() => {
    const colors = data.map((item) => item.segmentText[0]?.highlightColor ?? 0);
    const [minColor, maxColor] = [Math.min(...colors), Math.max(...colors)];

    return (
      chroma
        .scale("Reds")
        .correctLightness(true)
        .padding(isDarkTheme ? [0, 0.4] : [0.4, 0])
        // small trick to make it readable in both color schemes
        .domain(isDarkTheme ? [minColor, maxColor] : [maxColor, minColor])
    );
  }, [data, isDarkTheme]);

  return (
    <Paper elevation={1} sx={{ flex: 1, py: 2, pl: 2, my: 1 }}>
      <Allotment>
        {/* Left view - text (main view) */}
        <Allotment.Pane>
          <Virtuoso
            totalCount={data.length}
            data={data}
            itemContent={(index, data) => (
              <TextSegment index={index} data={data} colorScale={colorScale} />
            )}
            endReached={onEndReached}
            startReached={onStartReached}
            overscan={20}
            components={{ Footer }}
          />
        </Allotment.Pane>

        {/* Middle view - parallels for selected segment */}
        <Allotment.Pane visible={Boolean(selectedSegmentId)}>
          <TextViewMiddleParallels parallelIds={[]} />
        </Allotment.Pane>
      </Allotment>
    </Paper>
  );
}
