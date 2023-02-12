import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import CopyIcon from "@mui/icons-material/ContentCopy";
import PercentIcon from "@mui/icons-material/Percent";
import type { Theme } from "@mui/material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Link,
  Tooltip,
  useTheme,
} from "@mui/material";
import type { ApiTextSegment } from "types/api/table";
import { SourceLanguage } from "utils/constants";

import { ParallelSegmentText } from "./ParallelSegmentText";

interface ParallelSegmentProps {
  language: SourceLanguage;
  displayName: string;
  length: number;

  text: ApiTextSegment[];
  textSegmentNumbers: [start: string, end: string];

  score?: number;
}

const getLanguageColor = (language: SourceLanguage, theme: Theme): string => {
  switch (language) {
    case SourceLanguage.PALI: {
      return theme.palette.common.pali;
    }
    case SourceLanguage.TIBETAN: {
      return theme.palette.common.tibetan;
    }
    case SourceLanguage.CHINESE: {
      return theme.palette.common.chinese;
    }
    case SourceLanguage.SANSKRIT: {
      return theme.palette.common.sanskrit;
    }
    default: {
      return theme.palette.common.black;
    }
  }
};

export const ParallelSegment = ({
  textSegmentNumbers,
  text,
  score,
  length,
  displayName,
  language,
}: ParallelSegmentProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const sourceLanguageName = t(`language.${language}`);

  // Example: ["dn1:1.1.1_0", "dn1:1.1.2_0"] -> ["dn1", "1.1.1_0"]
  const [textName, segmentName] = textSegmentNumbers[0].split(":");
  const infoToCopy = `${textSegmentNumbers.join("-")}: ${displayName}`;

  // Example of copied data: dn1:1.1.1_0–1.1.2_0: Brahmajāla Sutta
  const copyTextInfoToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(infoToCopy);
  }, [infoToCopy]);

  const languageBadgeColor = useCallback(
    () => getLanguageColor(language, theme),
    [language, theme]
  );

  return (
    <Card sx={{ flex: 1, wordBreak: "break-all" }}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          bgcolor: "background.header",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap" }}>
          {/* Language name */}
          <Chip
            size="small"
            label={sourceLanguageName}
            sx={{
              m: 0.5,
              p: 0.5,
              color: "white",
              fontWeight: 700,
              backgroundColor: languageBadgeColor,
            }}
          />

          {/* File Name */}
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <Link
              href={`/db/text/${language}/${textName}?segment=${segmentName}`}
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
        <ParallelSegmentText text={text} />
      </CardContent>
    </Card>
  );
};
