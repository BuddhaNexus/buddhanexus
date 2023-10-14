import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";
import { scriptSelectionAtom } from "features/atoms";
import { useAtomValue } from "jotai";
import { EwtsConverter } from "tibetan-ewts-converter";
import type { ApiTextSegment } from "types/api/common";
import { SourceLanguage } from "utils/constants";

interface Props {
  text: ApiTextSegment[];
}

export const ParallelSegmentText = ({ text }: Props) => {
  const ewts = new EwtsConverter();

  const { sourceLanguage } = useDbQueryParams();
  const scriptSelection = useAtomValue(scriptSelectionAtom);

  return (
    <>
      {text.map(({ text, highlightColor }) => {
        const renderText =
          scriptSelection === "Wylie" &&
          sourceLanguage === SourceLanguage.TIBETAN
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
