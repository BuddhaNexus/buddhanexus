import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { SourceLanguageChip } from "@components/common/SourceLanguageChip";
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined";
import CopyIcon from "@mui/icons-material/ContentCopy";
import MovingOutlinedIcon from "@mui/icons-material/MovingOutlined";
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
    segmentNumbers,
    language,
    fileName,
    matchCenteredness,
    matchDistance,
    ...text
  } = result;

  // TODO: awaiting endpoint update
  const displayName = fileName;

  // // Example: ["dn1:1.1.1_0", "dn1:1.1.2_0"] -> ["dn1", "1.1.1_0"]
  const [textName, segmentName] = segmentNumbers[0]
    ? segmentNumbers[0].split(":")
    : [];

  const copyTextInfoToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(
      `${segmentNumbers.join("-")}: ${displayName}`,
    );
  }, []);

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

          <Box>
            <Tooltip
              title="Match distance"
              PopperProps={{ disablePortal: true }}
            >
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                icon={<MovingOutlinedIcon />}
                label={matchDistance}
                sx={{ mr: 0.5, my: 0.5, p: 0.5 }}
              />
            </Tooltip>
            {matchCenteredness && (
              <Tooltip
                title="Match centeredness"
                PopperProps={{ disablePortal: true }}
              >
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<AdjustOutlinedIcon />}
                  label={matchCenteredness}
                  sx={{ mr: 0.5, my: 0.5, p: 0.5 }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap" }}>
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <Link
              href={`/db/${language}/${textName}/text?selectedSegment=${segmentName}`}
              sx={{ display: "inline-block", wordBreak: "break-word", m: 0.5 }}
            >
              {segmentNumbers[0]}
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
        <SearchResultItemText matchText={{ id, ...text }} />
      </CardContent>
    </Card>
  );
};
