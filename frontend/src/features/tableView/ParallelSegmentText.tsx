import { scriptSelectionAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { enscriptText } from "@features/SidebarSuite/utils";
import { Typography } from "@mui/material";
import { APISchemas } from "@utils/api/types";
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
        const isMatch = highlightColor === 1;

        return (
          <Typography
            key={segmentText}
            sx={{ display: "inline" }}
            fontWeight={isMatch ? 600 : 400}
            color={isMatch ? "text.primary" : "text.secondary"}
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
