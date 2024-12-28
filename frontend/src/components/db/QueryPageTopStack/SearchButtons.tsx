import * as React from "react";
import { useTranslation } from "next-i18next";
import {
  useExcludeCategoriesParam,
  useExcludeCollectionsParam,
  useExcludeFilesParam,
  useIncludeCategoriesParam,
  useIncludeCollectionsParam,
  useIncludeFilesParam,
  useLanguageParam,
} from "@components/hooks/params";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Button, ButtonGroup } from "@mui/material";

export const SearchButtons = () => {
  const { t } = useTranslation("settings");

  const { setIsSettingsOpen } = useSettingsDrawer();

  const [, setExcludeCollectionsParam] = useExcludeCollectionsParam();
  const [, setExcludeCategoriesParam] = useExcludeCategoriesParam();
  const [, setExcludeFilesParam] = useExcludeFilesParam();
  const [, setIncludeCollectionsParam] = useIncludeCollectionsParam();
  const [, setIncludeCategoriesParam] = useIncludeCategoriesParam();
  const [, setIncludeFilesParam] = useIncludeFilesParam();
  const [, setLanguageParam] = useLanguageParam();

  const handleReset = React.useCallback(async () => {
    await Promise.all([
      setExcludeCollectionsParam(null),
      setExcludeCategoriesParam(null),
      setExcludeFilesParam(null),
      setIncludeCollectionsParam(null),
      setIncludeCategoriesParam(null),
      setIncludeFilesParam(null),
      setLanguageParam(null),
    ]);
  }, [
    setExcludeCollectionsParam,
    setExcludeCategoriesParam,
    setExcludeFilesParam,
    setIncludeCollectionsParam,
    setIncludeCategoriesParam,
    setIncludeFilesParam,
    setLanguageParam,
  ]);

  return (
    <ButtonGroup variant="outlined">
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
    </ButtonGroup>
  );
};
