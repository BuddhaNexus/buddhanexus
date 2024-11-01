import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom, isDbSourceBrowserDrawerOpenAtom } from "@atoms";
import { getTextPath } from "@components/common/utils";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAtomValue, useSetAtom } from "jotai";

import { buttonWrapperStyles } from "./QueryPageButtons";

export const DbFileButtons = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();

  const { fileName, dbLanguage } = useDbRouterParams();
  const dbView = useAtomValue(currentDbViewAtom);

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const setIsSourceTreeOpen = useSetAtom(isDbSourceBrowserDrawerOpenAtom);
  const { setIsSettingsOpen } = useSettingsDrawer();

  const handleReset = React.useCallback(async () => {
    const url = {
      pathname: getTextPath({ dbLanguage, fileName, dbView }),
      query: {},
    };
    await router.push(url, undefined, { shallow: true });
  }, [dbLanguage, fileName, dbView, router]);

  return (
    <Box sx={buttonWrapperStyles}>
      <Button
        variant="outlined"
        data-testid="db-results-settings-button"
        aria-label={t(`resultsHead.settingsTip`)}
        title={t(`resultsHead.settingsTip`)}
        startIcon={isLg && <TuneIcon />}
        onClick={() => setIsSettingsOpen((prev) => !prev)}
      >
        {t(`resultsHead.settings`)}
      </Button>

      <Button
        variant="outlined"
        data-testid="db-results-clear-settings-button"
        aria-label={t(`resultsHead.resetTip`)}
        title={t(`resultsHead.resetTip`)}
        startIcon={isLg && <RotateLeftOutlinedIcon />}
        onClick={handleReset}
      >
        {t(`resultsHead.reset`)}
      </Button>

      <Button
        variant="outlined"
        data-testid="db-results-text-select-modal-button"
        aria-label={t(`resultsHead.textSelectTip`)}
        title={t(`resultsHead.textSelectTip`)}
        startIcon={isLg && <GradingOutlinedIcon />}
        onClick={() => setIsSourceTreeOpen(true)}
      >
        {t(`resultsHead.textSelect`)}
      </Button>
    </Box>
  );
};
