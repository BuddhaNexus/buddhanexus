import { Virtuoso } from "react-virtuoso";
import { Paper, Typography } from "@mui/material";
import type { SegmentColorId } from "types/api/common";
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

function getSegmentColor(highlightColor: SegmentColorId) {
  return {
    0: "blue",
    1: "red",
    2: "yellow",
    3: "green",
    4: "green",
    5: "green",
    6: "green",
    7: "green",
    8: "green",
    9: "green",
    10: "green",
  }[highlightColor];
}

export default function TextView({
  data,
  onEndReached,
  onStartReached,
}: Props) {
  return (
    <Paper elevation={1} sx={{ flex: 1, p: 2, my: 1 }}>
      <Virtuoso
        totalCount={data.length}
        data={data}
        itemContent={(index, data) => (
          <Typography
            variant="body3"
            component="p"
            sx={{ color: getSegmentColor(data.segmentText[0].highlightColor) }}
          >
            {data.segmentText[0].text}
          </Typography>
        )}
        endReached={onEndReached}
        startReached={onStartReached}
        overscan={20}
        components={{ Footer }}
      />
    </Paper>
  );
}
