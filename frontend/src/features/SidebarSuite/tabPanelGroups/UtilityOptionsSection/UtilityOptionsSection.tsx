import React, { useMemo, useState } from "react";
import useDownloader from "react-use-downloader";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";
import {
  Popper,
  PopperMsgBox,
} from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import {
  defaultAnchorEls,
  type PopperAnchorState,
} from "@features/SidebarSuite/tabPanelGroups/UtilityOptionsSection/utils";
import {
  SidebarSuitePageContext,
  UtilityUISettingName,
} from "@features/SidebarSuite/types";
import { utilityComponents } from "@features/SidebarSuite/uiSettings";
import {
  allUIComponentParamNames,
  utilityUISettings,
} from "@features/SidebarSuite/uiSettings/config";
import { getAvailableSettings } from "@features/SidebarSuite/utils";
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
  UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES,
  UNAVAILABLE_SEARCH_PAGE_UI_UTILITIES,
} from "src/features/SidebarSuite/tabPanelGroups/config";

export const UtilityOptionsSection = ({
  pageType = "dbSourceFile",
}: {
  pageType: SidebarSuitePageContext;
}) => {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);
  const { fileName, dbLanguage } = useNullableDbRouterParams();
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
        (setting) => !UNAVAILABLE_SEARCH_PAGE_UI_UTILITIES.includes(setting),
      );
    }

    if (!dbLanguage) {
      // TODO: create error component
      return [];
    }

    return getAvailableSettings<UtilityUISettingName>({
      dbLanguage,
      uiSettings: utilityUISettings,
      unavailableSettingsForViewOrLang:
        UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES[currentView],
    });
  }, [dbLanguage, currentView, pageType]);

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
