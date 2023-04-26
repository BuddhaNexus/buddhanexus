import React, { useState } from "react";
import useDownloader from "react-use-downloader";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
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
import { currentDbViewAtom } from "features/sidebar/settingComponents/DbViewSelector";
import { useAtomValue } from "jotai";
import { DbApi } from "utils/api/dbApi";
import {
  defaultAnchorEls,
  onCopyQueryLink,
  onCopyQueryTitle,
  onDownload,
  onEmailQueryLink,
  type UtilityClickHandlerProps,
} from "utils/dbUISettingHelpers";
import {
  isSettingOmitted,
  UTILITY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type UtilityOption,
} from "utils/dbUISettings";

import { Popper, PopperMsgBox } from "./MuiStyledSidebarComponents";

type UtilityOptionObject = {
  callback: (props: UtilityClickHandlerProps) => void;
  icon: OverridableComponent<SvgIconTypeMap>;
};

type UtilityOptions = {
  [key in UtilityOption]: UtilityOptionObject;
};

const utilityOptionComponents: UtilityOptions = {
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
  const currentView = useAtomValue(currentDbViewAtom);
  const { fileName, sourceLanguage, serializedParams } = useDbQueryParams();
  const { t } = useTranslation("settings");
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
    useState<Record<UtilityOption, HTMLElement | null>>(defaultAnchorEls);

  const listItems = React.Children.toArray(
    Object.entries(utilityOptionComponents).map(([key, option]) => {
      const { callback, icon: Icon } = option;
      const name = key as UtilityOption;

      if (
        isSettingOmitted({
          omissions,
          settingName: name,
          dbLang: sourceLanguage,
          view: currentView,
        })
      ) {
        return null;
      }

      const isPopperOpen = Boolean(popperAnchorEl[name]);
      const showPopper = name === "download" ? Boolean(error) : true;
      const popperId = isPopperOpen ? `${name}-popper` : undefined;

      return (
        <ListItem
          key={name}
          disablePadding
          onMouseLeave={() => setPopperAnchorEl(defaultAnchorEls)}
        >
          <ListItemButton
            id={name}
            aria-describedby={popperId}
            onClick={(event) =>
              callback({
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
            <ListItemText primary={t(`optionsLabels.${name}`)} />
          </ListItemButton>

          {showPopper && (
            <Popper
              id={popperId}
              open={isPopperOpen}
              anchorEl={popperAnchorEl[name]}
              placement="top"
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                  <PopperMsgBox>{t(`optionsPopperMsgs.${name}`)}</PopperMsgBox>
                </Fade>
              )}
            </Popper>
          )}
        </ListItem>
      );
    })
  );

  return listItems.length > 0 ? (
    <>
      <Typography variant="h6" component="h3" mx={2} mt={3}>
        {t("headings.tools")}
      </Typography>

      <List>{listItems}</List>
    </>
  ) : null;
};
