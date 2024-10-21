import { scriptSelectionAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { enscriptText } from "@features/SidebarSuite/utils";
import { Typography } from "@mui/material";
import type { APISchemas } from "@utils/api/types";
import { useAtomValue } from "jotai";

interface Props {
  text: APISchemas["FullText"][];
}

export const ParallelSegmentText = ({ text }: Props) => {
  const { dbLanguage } = useDbRouterParams();
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
              language: dbLanguage,
            })}
          </Typography>
        );
      })}
    </>
  );
};
