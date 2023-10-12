import { useSearchParams } from "next/navigation";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";
import { EwtsConverter } from "tibetan-ewts-converter";
import type { ApiTextSegment } from "types/api/table";

interface Props {
  text: ApiTextSegment[];
}

export const ParallelSegmentText = ({ text }: Props) => {
  // let { EwtsConverter } = require("tibetan-ewts-converter");
  const ewts = new EwtsConverter();

  const { uniqueSettings } = useDbQueryParams();
  const scriptParam = useSearchParams().get(uniqueSettings.local.script);

  return (
    <>
      {text.map(({ text, highlightColor }) => {
        const renderText =
          scriptParam === "Wylie" ? ewts.to_unicode(text) : text;
        return (
          <Typography
            key={text}
            sx={{ display: "inline" }}
            fontWeight={highlightColor === 1 ? 600 : 400}
            color={highlightColor === 1 ? "text.primary" : "text.secondary"}
          >
            {renderText}
          </Typography>
        );
      })}
    </>
  );
};
