import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getAvailableDBViews } from "@components/hooks/useDbView";
import { currentViewAtom } from "@features/atoms";
import { Button, Menu, MenuItem } from "@mui/material";
import { DEFAULT_DB_VIEW, SOURCE_LANGUAGES } from "@utils/constants";
import { getValidDbLanguage } from "@utils/validators";
import { useAtom } from "jotai";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

export const DatabaseMenu = () => {
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const { t } = useTranslation();
  const router = useRouter();

  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  const handleLanguageChange = React.useCallback(
    async (language: string) => {
      const availableViews = getAvailableDBViews(getValidDbLanguage(language));
      if (!availableViews.includes(currentView)) {
        setCurrentView(DEFAULT_DB_VIEW);
      }
      await router.push(`/db/${language}`);
    },
    [router, currentView, setCurrentView],
  );

  return (
    <>
      <Button variant="text" color="inherit" {...bindTrigger(popupState)}>
        {t("header.database")}
      </Button>
      <Menu {...bindMenu(popupState)}>
        {SOURCE_LANGUAGES.map((language) => (
          <MenuItem
            key={language}
            onClick={async () => {
              popupState.close();
              await handleLanguageChange(language);
            }}
          >
            {t(`language.${language}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
