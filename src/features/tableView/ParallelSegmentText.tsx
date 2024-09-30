import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { scriptSelectionAtom } from "@features/atoms";
import { enscriptText } from "@features/sidebarSuite/common/dbSidebarHelpers";
import { Typography } from "@mui/material";
import type { APIFullText } from "@utils/api/types";
import { useAtomValue } from "jotai";

interface Props {
  text: APIFullText[];
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
              text: segmentText ?? "",
              script,
              language: sourceLanguage,
            })}
          </Typography>
        );
      })}
    </>
  );
};
