import { Typography } from "@mui/material";
import type { ApiTextSegment } from "types/api/table";

interface Props {
  text: ApiTextSegment[];
}

export const ParallelSegmentText = ({ text }: Props) => (
  <>
    {text.map(({ text, highlightColor }) => (
      <Typography
        key={text}
        sx={{ display: "inline" }}
        fontWeight={highlightColor === 1 ? 600 : 400}
        color={highlightColor === 1 ? "text.primary" : "text.secondary"}
      >
        {text}
      </Typography>
    ))}
  </>
);
