import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getTextPath } from "@components/common/utils";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import { currentViewAtom, isDbSourceBrowserDrawerOpen } from "@features/atoms";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, Stack } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";

/**
 * Renders a Stack UI component for the top of query pages with query
 * info chips, a reset button and a sidebar toggle. Applicable to:
 * - db view pages
 * - search page
 *
 */
export const QueryPageTopStack = ({ matches = 0 }: { matches?: number }) => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const isSearchRoute = router.route.startsWith("/search");

  const { fileName, sourceLanguage } = useDbQueryParams();
  const dbView = useAtomValue(currentViewAtom);

  const setIsSourceTreerOpen = useSetAtom(isDbSourceBrowserDrawerOpen);
  const { setIsSettingsOpen } = useSettingsDrawer();

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search_string");

  const handleReset = async () => {
    const url = isSearchRoute
      ? {
          pathname: "/search",
          query: { search_string: searchTerm },
        }
      : {
          pathname: getTextPath({ sourceLanguage, fileName, dbView }),
          query: {},
        };

    await router.push(url, undefined, { shallow: true });
  };

  return (
    <Stack
      direction={{ xs: "row", lg: "row-reverse" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ pt: 2, pb: 3 }}
    >
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}
      >
        <Button
          variant="outlined"
          data-testid="db-results-settings-button"
          aria-label={t(`resultsHead.settingsTip`)}
          title={t(`resultsHead.settingsTip`)}
          startIcon={<TuneIcon />}
          onClick={() => setIsSettingsOpen((prev) => !prev)}
        >
          {t(`resultsHead.settings`)}
        </Button>
        <Button
          variant="outlined"
          data-testid="db-results-clear-settings-button"
          aria-label={t(`resultsHead.resetTip`)}
          title={t(`resultsHead.resetTip`)}
          startIcon={<RotateLeftOutlinedIcon />}
          onClick={handleReset}
        >
          {t(`resultsHead.reset`)}
        </Button>
        {isSearchRoute ? null : (
          <Box sx={{ order: { xs: 2, lg: -1 } }}>
            <Button
              variant="outlined"
              data-testid="db-results-text-select-modal-button"
              aria-label={t(`resultsHead.textSelectTip`)}
              title={t(`resultsHead.textSelectTip`)}
              startIcon={<GradingOutlinedIcon />}
              onClick={() => setIsSourceTreerOpen(true)}
            >
              {t(`resultsHead.textSelect`)}
            </Button>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <CurrentResultChips matches={matches} />
      </Box>
    </Stack>
  );
};
