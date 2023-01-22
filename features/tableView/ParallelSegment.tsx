import { useTranslation } from "next-i18next";
import {
  Card,
  CardContent,
  Chip,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import type { SourceLanguage } from "utils/constants";

interface ParallelSegmentProps {
  language: SourceLanguage;
  fileName: string;
  length: number;

  textColorMap: number[];
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
      <CardContent>
        <Tooltip title={fileName}>
          <Typography sx={{ mb: 1, display: "inline", mr: 0.5 }}>
            {textSegmentNumbers}
          </Typography>
        </Tooltip>
        <Chip size="small" label={sourceLanguageName} sx={{ mx: 0.5 }} />
        {score && (
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            label={`Score: ${score}`}
            sx={{ mx: 0.5 }}
          />
        )}
        <Chip size="small" label={`Length: ${length}`} sx={{ mx: 0.5 }} />
      </CardContent>
      <Divider />
      <CardContent>
        <Typography>Text: {text}</Typography>
        <Typography>{textColorMap}</Typography>
      </CardContent>
    </Card>
  );
};
