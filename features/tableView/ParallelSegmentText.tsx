import { useSearchParams } from "next/navigation";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";
import { EwtsConverter } from "tibetan-ewts-converter";
import type { ApiTextSegment } from "types/api/table";
import { SourceLanguage } from "utils/constants";

interface Props {
  text: ApiTextSegment[];
}

export const ParallelSegmentText = ({ text }: Props) => {
  const ewts = new EwtsConverter();

  const { uniqueSettings, sourceLanguage } = useDbQueryParams();
  const scriptParam = useSearchParams().get(uniqueSettings.local.script);

  return (
    <>
      {text.map(({ text, highlightColor }) => {
        const renderText =
          scriptParam === "Wylie" && sourceLanguage === SourceLanguage.TIBETAN
            ? ewts.to_unicode(text)
            : text;
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
