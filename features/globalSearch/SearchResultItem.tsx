import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { SourceLanguageChip } from "@components/common/SourceLanguageChip";
import CopyIcon from "@mui/icons-material/ContentCopy";
import DifferenceIcon from "@mui/icons-material/Difference";
import { CardContent, Chip, Divider, IconButton, Tooltip } from "@mui/material";
import type { SearchResult } from "utils/api/search";

import {
  SearchResultCard,
  SearchResultHeaderChips,
  SearchResultHeaderTitleRow,
  SearchResultLink,
} from "./GlobalSearchStyledMuiComponents";
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

  const path = `/db/${language}/${id}/text?selectedSegment=${segmentNumber}`;

  return (
    <SearchResultCard>
      <CardContent
        sx={{
          bgcolor: "background.card",
        }}
      >
        <SearchResultHeaderChips>
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
        </SearchResultHeaderChips>

        <SearchResultHeaderTitleRow>
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <SearchResultLink href={path}>{segmentNumber}</SearchResultLink>
          </Tooltip>
          <IconButton
            aria-label="copy"
            size="small"
            onClick={copyTextInfoToClipboard}
          >
            <CopyIcon fontSize="inherit" />
          </IconButton>
        </SearchResultHeaderTitleRow>
      </CardContent>

      <Divider />

      <CardContent>
        <SearchResultItemText id={id} textParts={matchTextParts} />
      </CardContent>
    </SearchResultCard>
  );
};
