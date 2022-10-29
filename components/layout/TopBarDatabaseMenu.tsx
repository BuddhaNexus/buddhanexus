import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Button, Menu, MenuItem } from "@mui/material";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { SOURCE_LANGUAGES } from "utils/constants";

export const DatabaseMenu = () => {
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const { t } = useTranslation();
  const router = useRouter();

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
              await router.push(`/db/${language}`);
            }}
          >
            {t(`language.${language}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
