import { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { useTheme } from "next-themes";
import { Paper, Typography } from "@mui/material";
import chroma from "chroma-js";
import type { TextPageData } from "types/api/text";

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
    const colors = data.map((item) => item.segmentText[0].highlightColor);
    return [Math.min(...colors), Math.max(...colors)];
  }, [data]);

  const colorHelix = chroma
    .scale("Reds")
    // small trick to make it readable in both color schemes
    .domain(isDarkTheme ? [minColor, maxColor] : [maxColor, minColor]);

  return (
    <Paper elevation={1} sx={{ flex: 1, p: 2, my: 1 }}>
      <Virtuoso
        totalCount={data.length}
        data={data}
        itemContent={(index, data) => {
          const colorId = data.segmentText[0].highlightColor;
          return (
            <Typography
              variant="body3"
              component="p"
              sx={{
                color: colorHelix(colorId).hex(),
              }}
            >
              {data.segmentText[0].text}
            </Typography>
          );
        }}
        endReached={onEndReached}
        startReached={onStartReached}
        overscan={20}
        components={{ Footer }}
      />
    </Paper>
  );
}
