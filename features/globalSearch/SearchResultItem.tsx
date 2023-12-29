import React, { useCallback } from "react";
// import { useTranslation } from "next-i18next";
// import { SourceLanguageChip } from "@components/common/SourceLanguageChip";
import CopyIcon from "@mui/icons-material/ContentCopy";
import PercentIcon from "@mui/icons-material/Percent";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Link,
  Tooltip,
} from "@mui/material";
import type { ApiTextSegment } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { SearchResultItemText } from "./SearchResultItemText";

interface TEMPSearchResultsItem {
  language: `${SourceLanguage}`;
  filename: string;
  length: number;
  search_string_precise: string;
  offset_beg: number;
  offset_end: number;
  split_points_precise: Record<string, number>;
  segment_nr: [start: string, end: string];
  centeredness?: number;
}
interface Props {
  result: TEMPSearchResultsItem;
}

export const SearchResultItem = ({ result }: Props) => {
  // const { t } = useTranslation();

  const {
    segment_nr: textSegmentNumbers,
    search_string_precise,
    centeredness: score,
    filename,
    offset_beg,
    offset_end,
  } = result;

  const displayName = filename.split("/").at(-1);
  const { length } = search_string_precise;
  const textMarkers = [0, offset_beg, offset_end];
  const text: ApiTextSegment[] = textMarkers.reduce<ApiTextSegment[]>(
    (acc, val, index) => {
      if (index === 0 && offset_beg === 0) {
        return acc;
      }

      const resultPart: ApiTextSegment = {
        text: search_string_precise.slice(val, textMarkers[index + 1]),
        highlightColor: index === 1 ? 1 : 0,
        matches: [],
      };

      if (index === 2 && length > offset_end) {
        Object.assign(resultPart, {
          text: search_string_precise.slice(textMarkers[index]),
        });
      }
      return [...acc, resultPart];
    },
    [],
  );

  const language = "pli";

  // const sourceLanguageName = t(`language.${language}`);

  // Example: ["dn1:1.1.1_0", "dn1:1.1.2_0"] -> ["dn1", "1.1.1_0"]
  const [textName, segmentName] = textSegmentNumbers[0].split(":");
  const infoToCopy = `${textSegmentNumbers.join("-")}: ${displayName}`;

  // Example of copied data: dn1:1.1.1_0–1.1.2_0: Brahmajāla Sutta
  const copyTextInfoToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(infoToCopy);
  }, [infoToCopy]);

  return (
    <Card sx={{ flex: 1, wordBreak: "break-all" }}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          bgcolor: "background.card",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap" }}>
          {/* Language name */}
          {/* <SourceLanguageChip label={sourceLanguageName} language={language} /> */}

          {/* File Name */}
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <Link
              href={`/db/${language}/${textName}/text?selectedSegment=${segmentName}`}
              sx={{ display: "inline-block", wordBreak: "break-word", m: 0.5 }}
            >
              {textSegmentNumbers}
            </Link>
          </Tooltip>
          <IconButton
            aria-label="copy"
            size="small"
            onClick={copyTextInfoToClipboard}
          >
            <CopyIcon fontSize="inherit" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: { xs: "start", sm: "end" },
            alignItems: "center",
          }}
        >
          {score && (
            <Tooltip title="Score" PopperProps={{ disablePortal: true }}>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                icon={<PercentIcon />}
                label={score}
                sx={{ mr: 0.5, my: 0.5, p: 0.5 }}
              />
            </Tooltip>
          )}

          <Chip
            size="small"
            label={`Length: ${length}`}
            sx={{ m: 0.5, p: 0.5 }}
          />
        </Box>
      </CardContent>

      <Divider />

      <CardContent>
        <SearchResultItemText text={text} />
      </CardContent>
    </Card>
  );
};
