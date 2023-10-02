import { useTranslation } from "next-i18next";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

export default function MatchesChip({ matches }: { matches: number }) {
  const { t } = useTranslation("settings");

  return (
    <Chip
      size="small"
      label={
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>{t("resultsHead.matches")}</Box>
          <Box sx={{ minWidth: "2ch", ml: "3px", textAlign: "center" }}>
            {matches}
          </Box>
        </Box>
      }
      sx={{ mx: 0.5, p: 0.5 }}
    />
  );
}
