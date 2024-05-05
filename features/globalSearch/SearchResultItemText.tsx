import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";
import { scriptSelectionAtom } from "features/atoms";
import { enscriptText } from "features/sidebarSuite/common/dbSidebarHelpers";
import { useAtomValue } from "jotai";
import type { MatchTextPart } from "utils/api/search";

interface Props {
  id: string;
  textParts: MatchTextPart[];
}

export const SearchResultItemText = ({ id, textParts }: Props) => {
  const { sourceLanguage } = useDbQueryParams();
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
              text,
              script,
              language: sourceLanguage,
            })}
          </Typography>
        );
      })}
    </>
  );
};
