import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getTextPath } from "@components/common/utils";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, IconButton, Stack } from "@mui/material";
import { useAtomValue } from "jotai";

/**
 * Renders a Stack UI component for the top of query pages with query
 * info chips, a reset button and a sidebar toggle. Applicable to:
 * - db view pages
 * - search page
 *
 */
export const QueryPageTopStack = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();

  const { fileName, sourceLanguage, defaultQueryParams } = useDbQueryParams();
  const dbView = useAtomValue(currentViewAtom);

  const { isSettingsOpen, setIsSettingsOpen } = useSettingsDrawer();

  const handleReset = async () => {
    const isSearchRoute = router.route.startsWith("/search");

    const pathname = isSearchRoute
      ? "/search"
      : getTextPath({ sourceLanguage, fileName, dbView });
    await router.push(
      {
        pathname,
        query: { multi_lingual: defaultQueryParams.multi_lingual },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ pt: 2, pb: 3 }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          color="inherit"
          aria-label={t(`resultsHead.settingsToggle`)}
          title={t(`resultsHead.settingsToggle`)}
          edge="end"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <TuneIcon color="action" />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label={t(`resultsHead.reset`)}
          title={t(`resultsHead.reset`)}
          style={{ marginLeft: "8px" }}
          onClick={handleReset}
        >
          <RotateLeftOutlinedIcon color="action" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CurrentResultChips />
      </Box>
    </Stack>
  );
};
