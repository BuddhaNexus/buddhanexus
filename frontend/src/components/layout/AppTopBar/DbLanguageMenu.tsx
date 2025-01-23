import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { getAvailableDBViews } from "@components/hooks/useDbView";
import { Button, Menu, MenuItem } from "@mui/material";
import { dbLanguages } from "@utils/api/constants";
import { DEFAULT_DB_VIEW } from "@utils/constants";
import { getValidDbLanguage } from "@utils/validators";
import { useAtom } from "jotai";
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

interface DbLanguageMenuProps {
  type: "database" | "visual";
  isMobile?: boolean;
}

const mobileOffsetProps = {
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
} as const;

export const DbLanguageMenu = ({ type, isMobile }: DbLanguageMenuProps) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: `${type}Menu`,
  });
  const { t } = useTranslation();
  const router = useRouter();
  const [currentView, setCurrentView] = useAtom(currentDbViewAtom);

  const handleLanguageChange = React.useCallback(
    async (language: string) => {
      if (type === "database") {
        const availableViews = getAvailableDBViews(
          getValidDbLanguage(language),
        );
        if (!availableViews.includes(currentView)) {
          setCurrentView(DEFAULT_DB_VIEW);
        }
        await router.push(`/db/${language}`);
      } else {
        await router.push(`/db/${language}/visual`);
      }
    },
    [router, type, currentView, setCurrentView],
  );

  const menuProps = bindMenu(popupState);

  return (
    <>
      <Button
        variant="text"
        color="inherit"
        {...bindTrigger(popupState)}
        {...(isMobile && {
          sx: { "&:hover": { backgroundColor: "transparent" } },
        })}
      >
        {t(`header.${type}`)}
      </Button>

      <Menu {...menuProps} {...(isMobile && mobileOffsetProps)}>
        {dbLanguages.map((language) => (
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
