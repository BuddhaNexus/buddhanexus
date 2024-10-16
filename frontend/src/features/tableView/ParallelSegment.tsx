import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { SourceLanguageChip } from "@components/common/SourceLanguageChip";
import CopyIcon from "@mui/icons-material/ContentCopy";
import PercentIcon from "@mui/icons-material/Percent";
import StraightenIcon from "@mui/icons-material/Straighten";
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
import type { APISchemas } from "@utils/api/types";
import type { SourceLanguage } from "@utils/constants";

import { ParallelSegmentText } from "./ParallelSegmentText";

export const makeTextViewSegmentPath = ({
  segmentNumber,
  language,
}: {
  segmentNumber: string;
  language: SourceLanguage;
}) => {
  // Example: ["dn1:1.1.1_0", "dn1:1.1.2_0"] -> ["dn1", "1.1.1_0"]
  const [fileName] = segmentNumber.split(":");

  const urlEncodedSegmentNumber = encodeURIComponent(segmentNumber);

  return `/db/${language}/${fileName}/text?selectedSegment=${urlEncodedSegmentNumber}&selectedSegmentIndex=0`;
};

interface ParallelSegmentProps {
  language: SourceLanguage;
  displayName: string;
  length: number;

  text: APISchemas["FullText"][];
  textSegmentNumberRange: string;

  score?: number;
}

export const ParallelSegment = ({
  textSegmentNumberRange,
  text,
  score,
  length,
  displayName,
  language,
}: ParallelSegmentProps) => {
  const { t } = useTranslation();

  const sourceLanguageName = t(`language.${language}`);

  const infoToCopy = `${textSegmentNumberRange}: ${displayName}`;

  // Example of copied data: dn1:1.1.1_0–1.1.2_0: Brahmajāla Sutta
  const copyTextInfoToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(infoToCopy);
  }, [infoToCopy]);

  const linkSegmentNumber =
    textSegmentNumberRange.split("-")[0] ?? textSegmentNumberRange;

  return (
    <Card sx={{ flex: 1, wordBreak: "break-all", my: 1 }} elevation={1}>
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
          <SourceLanguageChip label={sourceLanguageName} language={language} />

          {/* File Name */}
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <Link
              href={makeTextViewSegmentPath({
                language,
                segmentNumber: linkSegmentNumber,
              })}
              sx={{ display: "inline-block", wordBreak: "break-word", m: 0.5 }}
              target="_blank"
              rel="noreferrer noopenner"
            >
              {textSegmentNumberRange}
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
            <Tooltip
              title={`${t("db.score")}: ${Math.round(score * 100) / 100}`}
              PopperProps={{ disablePortal: true }}
            >
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                icon={<PercentIcon />}
                label={score}
                sx={{ m: 0.5, p: 0.5 }}
              />
            </Tooltip>
          )}

          <Tooltip
            title={`${t("db.length")}: ${length}`}
            PopperProps={{ disablePortal: true }}
          >
            <Chip
              size="small"
              label={length}
              icon={<StraightenIcon />}
              sx={{ m: 0.5, p: 0.5 }}
            />
          </Tooltip>
        </Box>
      </CardContent>

      <Divider />

      <CardContent>
        <ParallelSegmentText text={text} />
      </CardContent>
    </Card>
  );
};
