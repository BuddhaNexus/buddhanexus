import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import type { SvgIconTypeMap } from "@mui/material";
import {
  Box,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  Typography,
} from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import { useAtomValue } from "jotai";
import {
  isSettingOmitted,
  UTILITY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type UtilityOption,
} from "utils/dbUISettings";

type PopperUtilityStates<State> = [
  Record<UtilityOption, State>,
  React.Dispatch<React.SetStateAction<Record<UtilityOption, State>>>
];
type PopperAnchorState = PopperUtilityStates<HTMLElement | null>;

interface UtilityClickHandlerProps {
  event: React.MouseEvent<HTMLElement>;
  fileName: string;
  popperAnchorState: PopperAnchorState;
}

const defaultAnchorEls = {
  download: null,
  copyQueryTitle: null,
  copyQueryLink: null,
  emailQueryLink: null,
};

const onDownload = ({
  // fileName,
  event,
  popperAnchorState,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

  // TODO: test if the download URL leads to a 404 and handle if so - most files I've tested lead to 404s

  /*  const DOWNLOAD_ROOT_URL = "https://buddhanexus.net/download";

  const url = `${DOWNLOAD_ROOT_URL}/${fileName}_download.xlsx`; 

  
  const testUrlValidity = await fetch(url);

  if (testUrlValidity.status === 404) { */
  setAnchorEl({
    ...defaultAnchorEls,
    download: anchorEl.download ? null : event.currentTarget,
  });
  /*  } else {
   const link = document.createElement("a");
    link.download = `${fileName}.xlsx`;
    link.href = url;
    link.click(); 
   } */
};

const onCopyQueryTitle = ({
  event,
  fileName,
  popperAnchorState,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  navigator.clipboard.writeText(fileName);
  setAnchorEl({
    ...defaultAnchorEls,
    copyQueryTitle: anchorEl.copyQueryTitle ? null : event.currentTarget,
  });
};

const onCopyQueryLink = ({
  event,
  popperAnchorState,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  navigator.clipboard.writeText(window.location.toString());
  setAnchorEl({
    ...defaultAnchorEls,
    copyQueryLink: anchorEl.copyQueryLink ? null : event.currentTarget,
  });
};

const onEmailQueryLink = ({
  event,
  fileName,
  popperAnchorState,
}: UtilityClickHandlerProps) => {
  const [anchorEl, setAnchorEl] = popperAnchorState;

  const subject = `BuddhaNexus serach results - ${fileName.toUpperCase()}`;
  const body = `Here is a link to search results for ${fileName.toUpperCase()}: ${window.location.toString()}`;

  const link = document.createElement("a");
  link.href = `mailto:?subject=${subject}&body=${body}`;
  link.click();
  setAnchorEl({
    ...defaultAnchorEls,
    emailQueryLink: anchorEl.emailQueryLink ? null : event.currentTarget,
  });
};

const utilityOptionComponents: [
  UtilityOption,
  (props: UtilityClickHandlerProps) => void,
  OverridableComponent<SvgIconTypeMap>
][] = [
  ["download", onDownload, FileDownloadIcon],
  ["copyQueryTitle", onCopyQueryTitle, LocalOfferOutlinedIcon],
  ["copyQueryLink", onCopyQueryLink, ShareOutlinedIcon],
  ["emailQueryLink", onEmailQueryLink, ForwardToInboxIcon],
];

export const UtilityOptionsSection = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);
  const { fileName, sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");
  const [popperAnchorEl, setPopperAnchorEl] =
    useState<Record<UtilityOption, HTMLElement | null>>(defaultAnchorEls);

  const listItems = React.Children.toArray(
    utilityOptionComponents.map((option) => {
      const [name, handleClick, Icon] = option;

      if (
        isSettingOmitted({
          omissions,
          settingName: name,
          dbLang: sourceLanguage,
          view: currentDbView,
        })
      ) {
        return null;
      }

      const isPopperOpen = Boolean(popperAnchorEl[name]);
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
              handleClick({
                event,
                fileName,
                popperAnchorState: [popperAnchorEl, setPopperAnchorEl],
              })
            }
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={t(`optionsLabels.${name}`)} />
          </ListItemButton>

          <Popper
            id={popperId}
            open={isPopperOpen}
            anchorEl={popperAnchorEl[name]}
            placement="top"
            sx={{ zIndex: 10000, height: "32px" }}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Box
                  sx={{
                    borderRadius: "8px",
                    p: 1,
                    bgcolor: "#333",
                    color: "white",
                  }}
                >
                  {t(`optionsPopperMsgs.${name}`)}
                </Box>
              </Fade>
            )}
          </Popper>
        </ListItem>
      );
    })
  );

  return listItems.length > 0 ? (
    <>
      <Typography variant="h6" mx={2}>
        {t("headings.tools")}
      </Typography>
      <List>{listItems}</List>
      <Divider sx={{ my: 2 }} />
    </>
  ) : null;
};
