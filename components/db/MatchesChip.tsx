import { useTranslation } from "next-i18next";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

export default function MatchesChip({
  matches,
  isSearchRoute,
}: {
  matches: number;
  isSearchRoute: boolean;
}) {
  const { t } = useTranslation("settings");
  const resultQualification = isSearchRoute && matches > 200 && "success";

  return (
    <>
      {resultQualification ? (
        // TODO: i18n
        <Tooltip
          id="matches-tooltip"
          title={
            <span
              style={{ fontSize: "1rem" }}
            >{`${matches} matches found. Search results limited to maximum 200 matches.`}</span>
          }
          placement="top-start"
          PopperProps={{ disablePortal: true }}
          sx={{ fontSize: "1rem" }}
        >
          <Chip
            size="small"
            label={
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>{t("resultsHead.matches")}</Box>
                <Box sx={{ minWidth: "2ch", ml: "3px", textAlign: "center" }}>
                  {matches}
                </Box>
                <Box sx={{ fontSize: "1.25em", mt: "-4px", ml: "2px" }}>*</Box>
              </Box>
            }
            sx={{ mx: 0.5, p: 0.5 }}
            aria-labelledby="matches-tooltip"
            role="status"
            tabIndex={0}
          />
        </Tooltip>
      ) : (
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
      )}
    </>
  );
}
