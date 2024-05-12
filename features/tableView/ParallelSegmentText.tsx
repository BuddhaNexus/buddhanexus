import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";
import { scriptSelectionAtom } from "features/atoms";
import { enscriptText } from "features/sidebarSuite/common/dbSidebarHelpers";
import { useAtomValue } from "jotai";
import type { ApiTextSegment } from "types/api/common";

interface Props {
  text: ApiTextSegment[];
}

export const ParallelSegmentText = ({ text }: Props) => {
  const { sourceLanguage } = useDbQueryParams();
  const script = useAtomValue(scriptSelectionAtom);

  if (!text) {
    return null;
  }

  return (
    <>
      {text?.map(({ text: segmentText, highlightColor }) => {
        return (
          <Typography
            key={segmentText}
            sx={{ display: "inline" }}
            fontWeight={highlightColor === 1 ? 600 : 400}
            color={highlightColor === 1 ? "text.primary" : "text.secondary"}
          >
            {enscriptText({
              text: segmentText,
              script,
              language: sourceLanguage,
            })}
          </Typography>
        );
      })}
    </>
  );
};
