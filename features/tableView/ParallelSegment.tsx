import React from "react";
import { useTranslation } from "next-i18next";
import PercentIcon from "@mui/icons-material/Percent";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ApiTextSegment } from "types/api/table";
import type { SourceLanguage } from "utils/constants";

import { ParallelSegmentText } from "./ParallelSegmentText";

interface ParallelSegmentProps {
  language: SourceLanguage;
  displayName: string;
  length: number;

  text: ApiTextSegment[];
  textSegmentNumbers: [start: string, end: string];

  score?: number;
}

export const ParallelSegment = ({
  textSegmentNumbers,
  text,
  score,
  length,
  displayName,
  language,
}: ParallelSegmentProps) => {
  const { t } = useTranslation();

  const sourceLanguageName = t(`language.${language}`);

  return (
    <Card sx={{ flex: 1, wordBreak: "break-all" }}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "background.header",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap" }}>
          {/* Language name */}
          <Chip
            size="small"
            label={sourceLanguageName}
            sx={{ m: 0.5, p: 0.5 }}
          />

          {/* File Name */}
          <Tooltip title={displayName} PopperProps={{ disablePortal: true }}>
            <Typography
              sx={{ display: "inline-block", wordBreak: "break-word", m: 0.5 }}
            >
              {textSegmentNumbers}
            </Typography>
          </Tooltip>
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
