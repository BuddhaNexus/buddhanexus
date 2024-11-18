import * as React from "react";
import { useTranslation } from "next-i18next";
import { isDbSourceBrowserDrawerOpenAtom } from "@atoms";
import {
  useExcludeCategoriesParam,
  useExcludeCollectionsParam,
  useExcludeFilesParam,
  useIncludeCategoriesParam,
  useIncludeCollectionsParam,
  useIncludeFilesParam,
  useLanguageParam,
  useLanguagesParam,
  useParLengthParam,
  useScoreParam,
} from "@components/hooks/params";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSetAtom } from "jotai";

import { buttonWrapperStyles } from "./QueryPageButtons";

export const DbFileButtons = () => {
  const { t } = useTranslation("settings");

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const setIsSourceTreeOpen = useSetAtom(isDbSourceBrowserDrawerOpenAtom);
  const { setIsSettingsOpen } = useSettingsDrawer();

  const [, setScoreParam] = useScoreParam();
  const [, setParLengthParam] = useParLengthParam();
  const [, setExcludeCollectionsParam] = useExcludeCollectionsParam();
  const [, setExcludeCategoriesParam] = useExcludeCategoriesParam();
  const [, setExcludeFilesParam] = useExcludeFilesParam();
  const [, setIncludeCollectionsParam] = useIncludeCollectionsParam();
  const [, setIncludeCategoriesParam] = useIncludeCategoriesParam();
  const [, setIncludeFilesParam] = useIncludeFilesParam();
  const [, setLanguageParam] = useLanguageParam();
  const [, setLanguagesParam] = useLanguagesParam();

  const handleReset = React.useCallback(async () => {
    await setScoreParam(null);
    await setParLengthParam(null);
    await setExcludeCollectionsParam(null);
    await setExcludeCategoriesParam(null);
    await setExcludeFilesParam(null);
    await setIncludeCollectionsParam(null);
    await setIncludeCategoriesParam(null);
    await setIncludeFilesParam(null);
    await setLanguageParam(null);
    await setLanguagesParam(null);
  }, [
    setScoreParam,
    setParLengthParam,
    setExcludeCollectionsParam,
    setExcludeCategoriesParam,
    setExcludeFilesParam,
    setIncludeCollectionsParam,
    setIncludeCategoriesParam,
    setIncludeFilesParam,
    setLanguageParam,
    setLanguagesParam,
  ]);

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
