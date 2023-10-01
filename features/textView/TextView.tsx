import { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { useTheme } from "next-themes";
import { Paper, Typography } from "@mui/material";
import chroma from "chroma-js";
import type { TextPageData } from "types/api/text";

import { TextSegment } from "./TextSegment";

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

  const [minColor, maxColor] = useMemo(() => {
    const colors = data.map((item) => item.segmentText[0]?.highlightColor ?? 0);
    return [Math.min(...colors), Math.max(...colors)];
  }, [data]);

  const colorScale = chroma
    .scale("Reds")
    // small trick to make it readable in both color schemes
    .domain(isDarkTheme ? [minColor, maxColor] : [maxColor, minColor]);

  return (
    <Paper elevation={1} sx={{ flex: 1, p: 2, my: 1 }}>
      {/* {data.map((segmentData, index) => (*/}
      {/*  <TextSegment*/}
      {/*    index={index}*/}
      {/*    data={segmentData}*/}
      {/*    color={colorHelix(segmentData.segmentText[0].highlightColor).hex()}*/}
      {/*  />*/}
      {/* ))}*/}

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
    </Paper>
  );
}
