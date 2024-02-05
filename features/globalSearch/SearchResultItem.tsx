import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { SourceLanguageChip } from "@components/common/SourceLanguageChip";
import CopyIcon from "@mui/icons-material/ContentCopy";
import DifferenceIcon from "@mui/icons-material/Difference";
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
import type { SearchResult } from "utils/api/search";

import { SearchResultItemText } from "./SearchResultItemText";

interface Props {
  result: SearchResult;
}

export const SearchResultItem = ({ result }: Props) => {
  const { t } = useTranslation();

  const {
    id,
    language,
    segmentNumber,
    displayName,
    similarity,
    matchTextParts,
  } = result;

  const copyTextInfoToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(`${segmentNumber}: ${displayName}`);
  }, [segmentNumber, displayName]);

  const roundedSimilarity =
    similarity % 1 === 0 ? similarity : similarity.toFixed(2);

  return (
    <Card sx={{ flex: 1, wordBreak: "break-all" }}>
      <CardContent
        sx={{
          bgcolor: "background.card",
        }}
      >
        <Box
          // TODO: convert to styled component
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <SourceLanguageChip
            label={t(`language.${language}`)}
            language={language}
          />

          <Tooltip
            title={`Similarity: ${roundedSimilarity}/100`}
            PopperProps={{ disablePortal: true }}
          >
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              icon={<DifferenceIcon />}
              label={roundedSimilarity}
              sx={{ mr: 0.5, my: 0.5, p: 0.5 }}
            />
          </Tooltip>
        </Box>

        <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap" }}>
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <Link
              href={`/db/${language}/${id}/text?selectedSegment=${segmentNumber}`}
              sx={{ display: "inline-block", wordBreak: "break-word", m: 0.5 }}
            >
              {segmentNumber}
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
      </CardContent>

      <Divider />

      <CardContent>
        <SearchResultItemText id={id} textParts={matchTextParts} />
      </CardContent>
    </Card>
  );
};
