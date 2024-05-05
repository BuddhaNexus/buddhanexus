import { useTranslation } from "next-i18next";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { SEARCH_RESULTS_LIMIT } from "utils/api/constants";

import CappedMatchesChip from "./CappedMatchesChip";

export default function SearchMatchesChip({
  matches,
  isSearchRoute,
}: {
  matches: number;
  isSearchRoute: boolean;
}) {
  const { t } = useTranslation("settings");
  const isMatchesCapped = isSearchRoute && matches >= SEARCH_RESULTS_LIMIT;

  if (isMatchesCapped) {
    return (
      <CappedMatchesChip
        label={t("resultsHead.matches")}
        message={t("resultsHead.cappedMessage", { max: SEARCH_RESULTS_LIMIT })}
        matches={matches}
      />
    );
  }

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
      aria-label={`${t("resultsHead.matches")} ${matches}`}
    />
  );
}
