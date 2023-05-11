import React, { useState } from "react";
import useDownloader from "react-use-downloader";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import type { SvgIconTypeMap } from "@mui/material";
import {
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import { useQuery } from "@tanstack/react-query";
import {
  defaultAnchorEls,
  isSettingOmitted,
  onCopyQueryLink,
  onCopyQueryTitle,
  onDownload,
  onEmailQueryLink,
  type UtilityClickHandlerProps,
} from "features/sidebar/common/dbSidebarHelpers";
import {
  UTILITY_OPTIONS_OMISSIONS_CONFIG as omissions,
  UtilityOptionEnum,
} from "features/sidebar/common/dbSidebarSettings";
import { useAtomValue } from "jotai";
import { DbApi } from "utils/api/dbApi";

import { Popper, PopperMsgBox } from "./common/MuiStyledSidebarComponents";

type UtilityOptionProps = {
  callback: (props: UtilityClickHandlerProps) => void;
  icon: OverridableComponent<SvgIconTypeMap>;
};

type UtilityOptions = {
  [value in UtilityOptionEnum]: UtilityOptionProps;
};

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
  const { fileName, sourceLanguage, serializedParams } = useDbQueryParams();
  let href: string;

  if (typeof window !== "undefined") {
    href = window.location.toString();
  }

  const { data: downloadData } = useQuery({
    queryKey: [DbApi.DownloadResults.makeQueryKey(fileName), serializedParams],
    queryFn: () =>
      DbApi.DownloadResults.call({
        fileName,
        serializedParams,
        view: currentView,
      }),
    refetchOnWindowFocus: false,
  });

  const { download, error } = useDownloader();

  const [popperAnchorEl, setPopperAnchorEl] =
    useState<Record<UtilityOptionEnum, HTMLElement | null>>(defaultAnchorEls);

  return (
    <>
      <Typography variant="h6" component="h3" mx={2} mt={3}>
        {t("headings.tools")}
      </Typography>

      <List>
        {Object.values(UtilityOptionEnum).map((utilityKey) => {
          const Icon = utilityComponents[utilityKey].icon;

          if (
            isSettingOmitted({
              omissions,
              settingName: utilityKey,
              language: sourceLanguage,
              view: currentView,
            })
          ) {
            return null;
          }

          const isPopperOpen = Boolean(popperAnchorEl[utilityKey]);
          const showPopper =
            utilityKey === UtilityOptionEnum.DOWNLOAD ? Boolean(error) : true;
          const popperId = isPopperOpen ? `${utilityKey}-popper` : undefined;

          return (
            <ListItem
              key={utilityKey}
              disablePadding
              onMouseLeave={() => setPopperAnchorEl(defaultAnchorEls)}
            >
              <ListItemButton
                id={utilityKey}
                aria-describedby={popperId}
                onClick={(event) =>
                  utilityComponents[utilityKey].callback({
                    event,
                    fileName,
                    popperAnchorState: [popperAnchorEl, setPopperAnchorEl],
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
