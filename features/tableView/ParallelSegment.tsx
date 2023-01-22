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
import type { ParallelHighlightMapSign } from "types/api/table";
import type { SourceLanguage } from "utils/constants";

import { ParallelSegmentText } from "./ParallelSegmentText";

interface ParallelSegmentProps {
  language: SourceLanguage;
  fileName: string;
  length: number;

  textColorMap: ParallelHighlightMapSign[];
  text: string;
  textSegmentNumbers: [start: string, end: string];

  score?: number;
}

export const ParallelSegment = ({
  textSegmentNumbers,
  text,
  textColorMap,
  score,
  length,
  fileName,
  language,
}: ParallelSegmentProps) => {
  const { t } = useTranslation();

  const sourceLanguageName = t(`language.${language}`);

  return (
    <Card sx={{ width: "50%", wordBreak: "break-all" }}>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "background.header",
        }}
      >
        <Box sx={{ alignItems: "center" }}>
          <Chip
            size="small"
            label={sourceLanguageName}
            sx={{ mr: 0.5, p: 0.5 }}
          />
          <Tooltip title={fileName}>
            <Typography sx={{ display: "inline", mx: 0.5 }}>
              {textSegmentNumbers}
            </Typography>
          </Tooltip>
        </Box>

        <Box>
          {score && (
            <Tooltip title="Score">
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                icon={<PercentIcon />}
                label={score}
                sx={{ mx: 0.5, p: 0.5 }}
              />
            </Tooltip>
          )}
          <Chip
            size="small"
            label={`Length: ${length}`}
            sx={{ mx: 0.5, p: 0.5 }}
          />
        </Box>
      </CardContent>

      <Divider />

      <CardContent>
        <ParallelSegmentText text={text} highlightMap={textColorMap} />
      </CardContent>
    </Card>
  );
};
