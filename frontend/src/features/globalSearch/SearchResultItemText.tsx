import { scriptSelectionAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { enscriptText } from "@features/sidebarSuite/common/dbSidebarHelpers";
import { Typography } from "@mui/material";
import type { APISchemas } from "@utils/api/types";
import { useAtomValue } from "jotai";

interface Props {
  id: string;
  textParts: APISchemas["FullText"][];
}

export const SearchResultItemText = ({ id, textParts }: Props) => {
  const { dbLanguage } = useDbRouterParams();
  const script = useAtomValue(scriptSelectionAtom);

  return (
    <>
      {textParts.map((textPart, index) => {
        const { text, highlightColor: highlighted } = textPart;
        return (
          <Typography
            key={`search-match-${id}-${index}`}
            sx={{ display: "inline" }}
            fontWeight={highlighted === 1 ? 600 : 400}
            color={highlighted === 1 ? "text.primary" : "text.secondary"}
          >
            {enscriptText({
              text: text ?? "",
              script,
              language: dbLanguage,
            })}
          </Typography>
        );
      })}
    </>
  );
};
