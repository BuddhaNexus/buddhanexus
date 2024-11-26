import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { DbLanguageChip } from "@components/common/DbLanguageChip";
import { useRightPaneActiveSegmentParam } from "@components/hooks/params";
import { useGetURLToSegment } from "@features/textView/useGetURLToSegment";
import CopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
import { DbLanguage } from "@utils/api/types";

import { ParallelSegmentText } from "./ParallelSegmentText";

interface ParallelSegmentProps {
  id?: string;
  language: DbLanguage;
  displayName: string;
  length: number;

  text: APISchemas["FullText"][];
  textSegmentNumber: string;
  textSegmentNumberRange: string;

  score?: number;
  onHover?: (parallelId: string) => void;
}

export const ParallelSegment = ({
  id,
  textSegmentNumber,
  textSegmentNumberRange,
  text,
  score,
  length,
  displayName,
  language,
  onHover,
}: ParallelSegmentProps) => {
  const { t } = useTranslation();

  const [rightPaneActiveSegmentId, setRightPaneActiveSegmentId] =
    useRightPaneActiveSegmentParam();

  const dbLanguageName = t(`language.${language}`);

  const infoToCopy = `${textSegmentNumberRange}: ${displayName}`;

  // Example of copied data: dn1:1.1.1_0–1.1.2_0: Brahmajāla Sutta
  const copyTextInfoToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(infoToCopy);
  }, [infoToCopy]);

  const openRightPane = useCallback(
    async (language: DbLanguage, segmentNumber: string) => {
      await setRightPaneActiveSegmentId(segmentNumber);
    },
    [setRightPaneActiveSegmentId],
  );

  const linkSegmentNumber =
    textSegmentNumberRange.split("-")[0] ?? textSegmentNumberRange;

  const { urlToSegment } = useGetURLToSegment({
    language,
    segmentNumber: linkSegmentNumber,
  });

  return (
    <Card
      sx={{ flex: 1, wordBreak: "break-all", my: 1 }}
      elevation={1}
      onMouseEnter={() => id && onHover?.(id)}
      onMouseLeave={() => onHover?.("")}
    >
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
          <DbLanguageChip label={dbLanguageName} language={language} />

          {/* File Name */}
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <Link
              href={urlToSegment}
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
          <IconButton
            aria-label="Open in new pane"
            size="small"
            onClick={() => openRightPane(language, textSegmentNumber)}
          >
            <OpenInNewIcon fontSize="inherit" />
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
