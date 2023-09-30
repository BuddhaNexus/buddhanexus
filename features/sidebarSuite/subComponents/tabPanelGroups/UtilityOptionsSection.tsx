import React, { useState } from "react";
import useDownloader from "react-use-downloader";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
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
import { useQuery } from "@tanstack/react-query";
import {
  defaultAnchorEls,
  isSettingOmitted,
  onCopyQueryLink,
  onCopyQueryTitle,
  onDownload,
  onEmailQueryLink,
  type PopperAnchorState,
  type UtilityOptions,
} from "features/sidebarSuite/common/dbSidebarHelpers";
import {
  Popper,
  PopperMsgBox,
} from "features/sidebarSuite/common/MuiStyledSidebarComponents";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import { useAtomValue } from "jotai";
import { DbApi } from "utils/api/dbApi";

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
  const currentView = useAtomValue(currentViewAtom);
  const {
    fileName,
    sourceLanguage,
    queryParams,
    settingRenderGroups,
    settingsOmissionsConfig,
  } = useDbQueryParams();
  let href: string;

  if (typeof window !== "undefined") {
    href = window.location.toString();
  }

  const { data: downloadData } = useQuery({
    // TODO: only needs to be called on click
    queryKey: DbApi.DownloadResults.makeQueryKey({ fileName, queryParams }),
    queryFn: () =>
      DbApi.DownloadResults.call({
        fileName,
        queryParams,
        view: currentView,
      }),
    refetchOnWindowFocus: false,
  });

  const { download, error } = useDownloader();

  const [popperAnchorEl, setPopperAnchorEl] =
    useState<PopperAnchorState>(defaultAnchorEls);

  return (
    <>
      <PanelHeading heading={t("headings.tools")} sx={{ mt: 3 }} />

      <List sx={{ m: 0 }}>
        {Object.values(settingRenderGroups.utilityOption).map((utilityKey) => {
          const Icon = utilityComponents[utilityKey].icon;

          if (
            isSettingOmitted({
              omissions: settingsOmissionsConfig.utilityOptions,
              settingName: utilityKey,
              language: sourceLanguage,
              view: currentView,
            })
          ) {
            return null;
          }

          const isPopperOpen = Boolean(popperAnchorEl[utilityKey]);
          const showPopper =
            utilityKey === settingRenderGroups.utilityOption.download
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
                    download: { call: download, file: downloadData },
                    href,
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
