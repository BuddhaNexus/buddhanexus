import React, { useState, useMemo } from "react";
import useDownloader from "react-use-downloader";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import {
  defaultAnchorEls,
  type PopperAnchorState,
} from "@features/sidebarSuite/common/dbSidebarHelpers";
import {
  Popper,
  PopperMsgBox,
} from "@features/sidebarSuite/common/MuiStyledSidebarComponents";
import PanelHeading from "@features/sidebarSuite/common/PanelHeading";

import {
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAtomValue } from "jotai";
import {
  utilityUISettings,
  allUIComponentParamNames,
} from "@features/sidebarSuite/uiSettingsLists";
import {
  UtilityUISettingName,
  SidebarSuitePageContext,
} from "@features/sidebarSuite/types";

import {
  getAvailableSettings,
  type UnavailableLanguages,
} from "@features/sidebarSuite/utils";

import { utilityComponents } from "@features/sidebarSuite/subComponents/uiSettings";
import { DbViewEnum } from "@utils/constants";

type LanguageUnabvailableSettings = Partial<
  Record<UtilityUISettingName, UnavailableLanguages>
>;
type UnavailableDisplaySettings = Record<
  DbViewEnum,
  LanguageUnabvailableSettings
>;

const UNAVAILABLE_DB_SOURCE_PAGE_SETTINGS: UnavailableDisplaySettings = {
  [DbViewEnum.GRAPH]: {
    download_data: "allLangs",
  },
  [DbViewEnum.NUMBERS]: {},
  [DbViewEnum.TABLE]: {
    download_data: "allLangs",
  },
  [DbViewEnum.TEXT]: {},
};

const UNAVAILABLE_SEARCH_PAGE_SETTINGS: UtilityUISettingName[] = [
  "download_data",
  "copyQueryTitle",
];

export const UtilityOptionsSection = ({
  pageType = "dbSourceFile",
}: {
  pageType: SidebarSuitePageContext;
}) => {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);
  const { fileName, sourceLanguage } = useDbRouterParams();
  let href: string;

  if (typeof window !== "undefined") {
    href = window.location.toString();
  }

  const { download, error } = useDownloader();

  const [popperAnchorEl, setPopperAnchorEl] =
    useState<PopperAnchorState>(defaultAnchorEls);

  const uiSettings = useMemo(() => {
    if (pageType === "search") {
      return utilityUISettings.filter(
        (setting) => !UNAVAILABLE_SEARCH_PAGE_SETTINGS.includes(setting)
      );
    }

    return getAvailableSettings<UtilityUISettingName>({
      sourceLanguage,
      uiSettings: utilityUISettings,
      unavailableSettingsForView:
        UNAVAILABLE_DB_SOURCE_PAGE_SETTINGS[currentView],
    });
  }, [sourceLanguage, currentView, pageType]);

  if (uiSettings.length === 0) {
    return null;
  }

  return (
    <>
      <PanelHeading heading={t("headings.tools")} sx={{ mt: 3 }} />

      <List sx={{ m: 0 }}>
        {uiSettings.map((utilityKey) => {
          const Icon = utilityComponents[utilityKey].icon;

          const isPopperOpen = Boolean(popperAnchorEl[utilityKey]);
          const showPopper =
            utilityKey === allUIComponentParamNames.download_data
              ? Boolean(error)
              : true;
          const popperId = isPopperOpen ? `${utilityKey}-popper` : undefined;

          return (
            <ListItem
              key={utilityKey}
              disablePadding
              onMouseLeave={() => setPopperAnchorEl(defaultAnchorEls)}
            >
              <ListItemButton
                id={utilityKey}
                sx={{ px: 0 }}
                aria-describedby={popperId}
                onClick={(event) =>
                  utilityComponents[utilityKey].callback({
                    event,
                    fileName,
                    popperAnchorStateHandler: [
                      popperAnchorEl,
                      setPopperAnchorEl,
                    ],
                    download: {
                      call: download,
                      fileName,
                      //TODO: queryParams
                      queryParams: {},
                    },
                    href,
                    messages: {
                      subject: t("generic.resutsSubject"),
                    },
                  })
                }
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={t(`optionsLabels.${utilityKey}`)} />
              </ListItemButton>

              {showPopper && (
                <Popper
                  id={popperId}
                  open={isPopperOpen}
                  anchorEl={popperAnchorEl[utilityKey]}
                  placement="top"
                  transition
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <PopperMsgBox>
                        {t(`optionsPopperMsgs.${utilityKey}`)}
                      </PopperMsgBox>
                    </Fade>
                  )}
                </Popper>
              )}
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
