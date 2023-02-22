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
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Typography,
} from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import { useAtomValue } from "jotai";
import { API_ROOT_URL } from "utils/api/constants";
import {
  isOnlyNull,
  isSettingOmitted,
  UTILITY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type UtilityOption,
} from "utils/dbUISettings";

type SnackbarState = Record<UtilityOption, boolean>;
type SnackbarStateSetter = [
  SnackbarState,
  React.Dispatch<React.SetStateAction<SnackbarState>>
];

const onDownload = async (
  fileName: string,
  snackbarState: SnackbarStateSetter
) => {
  const [snackbarIsOpen, setSnackbarIsOpen] = snackbarState;

  // https://buddhanexus.net/chn/T01n0004_download.xlsx
  // https://buddhanexus.net/download/dn6_download.xlsx

  const url = `${API_ROOT_URL}/download/${fileName}_download.xlsx`;
  const testUrlValidity = await fetch(url);

  if (testUrlValidity.status === 404) {
    setSnackbarIsOpen({ ...snackbarIsOpen, download: true });
  } else {
    const link = document.createElement("a");
    link.download = `${fileName}.xlsx`;
    link.href = url;
    link.click();
  }
};

const onCopyQueryTitle = (
  fileName: string,
  snackbarState: SnackbarStateSetter
) => {
  const [snackbarIsOpen, setSnackbarIsOpen] = snackbarState;
  setSnackbarIsOpen({ ...snackbarIsOpen, copyQueryTitle: true });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  navigator.clipboard.writeText(fileName);
};

const onCopyQueryLink = (
  fileName: string,
  snackbarState: SnackbarStateSetter
) => {
  const [snackbarIsOpen, setSnackbarIsOpen] = snackbarState;
  setSnackbarIsOpen({ ...snackbarIsOpen, copyQueryLink: true });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  navigator.clipboard.writeText(window.location.toString());
};

const onEmailQueryLink = (
  fileName: string,
  snackbarState: SnackbarStateSetter
) => {
  const [snackbarIsOpen, setSnackbarIsOpen] = snackbarState;
  setSnackbarIsOpen({ ...snackbarIsOpen, emailQueryLink: true });

  const subject = `BuddhaNexus serach results - ${fileName.toUpperCase()}`;
  const body = `Here is a link to search results for ${fileName.toUpperCase()}: ${window.location.toString()}`;

  const link = document.createElement("a");
  link.href = `mailto:?subject=${subject}&body=${body}`;
  link.click();
};

const utilityOptionComponents: [
  UtilityOption,
  (fileName: string, snackbarState: SnackbarStateSetter) => void,
  OverridableComponent<SvgIconTypeMap>
][] = [
  ["download", onDownload, FileDownloadIcon],
  ["copyQueryTitle", onCopyQueryTitle, LocalOfferOutlinedIcon],
  ["copyQueryLink", onCopyQueryLink, ShareOutlinedIcon],
  ["emailQueryLink", onEmailQueryLink, ForwardToInboxIcon],
];

type Props = {
  children: React.ReactNode;
};

const UtilityOptionsList: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation("settings");

  if (isOnlyNull(children as (React.ReactNode | null)[])) {
    return null;
  }

  return (
    <>
      <Typography variant="h6" mx={2}>
        {t("headings.tools")}
      </Typography>
      <List>{children}</List>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

export const UtilityOptions = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);
  const { fileName, sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");
  const [snackbarIsOpen, setSnackbarIsOpen] = useState({
    download: false,
    copyQueryTitle: false,
    copyQueryLink: false,
    emailQueryLink: false,
  });

  return (
    <UtilityOptionsList>
      {utilityOptionComponents.map((option) => {
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

        return (
          <ListItem key={name} disablePadding>
            <ListItemButton
              onClick={() =>
                handleClick(fileName, [snackbarIsOpen, setSnackbarIsOpen])
              }
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={t(`optionsLabels.${name}`)} />
            </ListItemButton>
            <Snackbar
              message={t(`optionsSnackbarMsgs.${name}`)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              autoHideDuration={3000}
              open={snackbarIsOpen[name]}
              onClose={() =>
                setSnackbarIsOpen({ ...snackbarIsOpen, [name]: false })
              }
            />
          </ListItem>
        );
      })}
    </UtilityOptionsList>
  );
};
