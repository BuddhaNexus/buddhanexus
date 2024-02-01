import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";
import { scriptSelectionAtom } from "features/atoms";
import { enscriptText } from "features/sidebarSuite/common/dbSidebarHelpers";
import { useAtomValue } from "jotai";

interface Props {
  matchText: {
    id: string;
    matchStringOriginal: string;
    matchStringStemmed: string;
    matchOffsetStart: number;
    matchOffsetEnd: number;
  };
}

export const SearchResultItemText = ({ matchText }: Props) => {
  const { sourceLanguage } = useDbQueryParams();
  const script = useAtomValue(scriptSelectionAtom);

  const { id, matchStringStemmed, matchOffsetStart, matchOffsetEnd } =
    matchText;

  const subStringStart = matchOffsetStart === 0 ? 0 : matchOffsetStart - 1;

  const matchStart = matchStringStemmed.slice(0, matchOffsetStart);
  const searchTerm = matchStringStemmed.slice(subStringStart, matchOffsetEnd);
  const matchEnd = matchStringStemmed.slice(matchOffsetEnd - 1);

  return (
    <>
      {[matchStart, searchTerm, matchEnd].map((textPart, index) => {
        return (
          <Typography
            key={`search-match-${id}-${index}`}
            sx={{ display: "inline" }}
            fontWeight={index === 1 ? 600 : 400}
            color={index === 1 ? "text.primary" : "text.secondary"}
          >
            {enscriptText({
              text: textPart,
              script,
              language: sourceLanguage,
            })}
          </Typography>
        );
      })}
    </>
  );
};
