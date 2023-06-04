import { Virtuoso } from "react-virtuoso";
import { Paper, Typography } from "@mui/material";
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
          <Typography variant="body3" component="p">
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
