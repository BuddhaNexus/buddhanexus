import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useSearchStringParam } from "@components/hooks/params";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button } from "@mui/material";

import { buttonWrapperStyles } from "./QueryPageButtons";

export const SearchButtons = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();

  const { setIsSettingsOpen } = useSettingsDrawer();

  const [search_string] = useSearchStringParam();

  const handleReset = React.useCallback(async () => {
    const url = {
      pathname: "/search",
      query: { search_string },
    };

    await router.push(url, undefined, { shallow: true });
  }, [search_string, router]);

  return (
    <Box sx={buttonWrapperStyles}>
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
    </Box>
  );
};
