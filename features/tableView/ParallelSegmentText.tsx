import { useMemo } from "react";
import { Typography } from "@mui/material";
import type { ParallelHighlightMapSign } from "types/api/table";

interface Props {
  text: string;
  // string of 0s and 1s, equal in length to the text
  // 0 => character not highlighted
  // 1 => character highlighted
  highlightMap: ParallelHighlightMapSign[];
}

interface HighlightPart {
  highlightColor: ParallelHighlightMapSign;
  text: string;
}

function extractParts(
  text: string,
  highlightMap: ParallelHighlightMapSign[]
): HighlightPart[] {
  if (!highlightMap) {
    return [];
  }

  const partsResult: HighlightPart[] = [];

  for (let i = 0; i < highlightMap.length; i++) {
    const sign = highlightMap[i];
    const character = text[i];

    if (partsResult.length === 0 || highlightMap[i] !== highlightMap[i - 1]) {
      partsResult.push({
        text: character,
        highlightColor: sign,
      });
    } else {
      const lastPart = partsResult.at(-1);
      if (!lastPart) {
        break;
      }
      lastPart.text += character;
    }
  }
  return partsResult;
}

export const ParallelSegmentText = ({ text, highlightMap }: Props) => {
  const parts: HighlightPart[] = useMemo(
    () => extractParts(text, highlightMap),
    [highlightMap, text]
  );

  return (
    <>
      {parts.map(({ text, highlightColor }) => (
        <Typography
          key={text}
          sx={{ display: "inline" }}
          fontWeight={highlightColor === 1 ? 700 : 400}
          color={highlightColor === 1 ? "text.primary" : "text.secondary"}
        >
          {text}
        </Typography>
      ))}
    </>
  );
};
