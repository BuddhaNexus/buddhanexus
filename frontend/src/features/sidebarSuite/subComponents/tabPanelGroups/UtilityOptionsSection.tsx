import React, { useState } from "react";
import useDownloader from "react-use-downloader";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import {
  defaultAnchorEls,
  isSettingOmitted,
  onCopyQueryLink,
  onCopyQueryTitle,
  onDownload,
  onEmailQueryLink,
  type PopperAnchorState,
  type UtilityOptions,
} from "@features/sidebarSuite/common/dbSidebarHelpers";
import {
  Popper,
  PopperMsgBox,
} from "@features/sidebarSuite/common/MuiStyledSidebarComponents";
import PanelHeading from "@features/sidebarSuite/common/PanelHeading";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
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
  uniqueSettings,
  pageSettings,
} from "@features/sidebarSuite/config/settings";

const utilityComponents: UtilityOptions = {
  download: {
    callback: onDownload,
    icon: FileDownloadIcon,
  },
  copyQueryTitle: {
    callback: onCopyQueryTitle,
    icon: LocalOfferOutlinedIcon,
  },
  copyQueryLink: {
    callback: onCopyQueryLink,
    icon: ShareOutlinedIcon,
  },
  emailQueryLink: {
    callback: onEmailQueryLink,
    icon: ForwardToInboxIcon,
  },
};

export const UtilityOptionsSection = () => {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);
  const { fileName, sourceLanguage } = useDbRouterParams();
  let href: string;

  if (typeof window !== "undefined") {
    href = window.location.toString();
  }

  const { route } = useRouter();

  const isSearchRoute = route.startsWith("/search");
  const { download, error } = useDownloader();

  const [popperAnchorEl, setPopperAnchorEl] =
    useState<PopperAnchorState>(defaultAnchorEls);

  return (
    <>
      <PanelHeading heading={t("headings.tools")} sx={{ mt: 3 }} />

      <List sx={{ m: 0 }}>
        {Object.values(
          pageSettings[isSearchRoute ? "search" : "dbResult"].utilityOptions
        ).map((utilityKey) => {
          const Icon = utilityComponents[utilityKey].icon;

          // if (
          //   isSettingOmitted({
          //     omissions: settingsOmissionsConfig.utilityOptions,
          //     settingName: utilityKey,
          //     language: sourceLanguage,
          //     pageContext: isSearchRoute ? "search" : currentView,
          //   })
          // ) {
          //   return null;
          // }

          const isPopperOpen = Boolean(popperAnchorEl[utilityKey]);
          const showPopper =
            utilityKey === pageSettings.dbResult.utilityOptions.download
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
