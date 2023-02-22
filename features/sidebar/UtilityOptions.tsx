import React from "react";
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
  Typography,
} from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import {
  FolioOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import { StandinFilter } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import {
  isOnlyNull,
  isSettingOmitted,
  UTILITY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type UtilityOption,
} from "utils/dbUISettings";

const utilityOptionComponents: [
  UtilityOption,
  React.ElementType,
  OverridableComponent<SvgIconTypeMap>
][] = [
  ["download", TextScriptOption, FileDownloadIcon],
  ["copyQueryTitle", FolioOption, LocalOfferOutlinedIcon],
  [
    "copyQueryLink",
    () => StandinFilter("showAndPositionSegmentNrs"),
    ShareOutlinedIcon,
  ],
  [
    "emailQueryLink",
    () => StandinFilter("showAndPositionSegmentNrs"),
    ForwardToInboxIcon,
  ],
];

type Props = {
  children: React.ReactNode;
};

const DisplayOptionsList: React.FC<Props> = ({ children }) => {
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
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");

  return (
    <DisplayOptionsList>
      {utilityOptionComponents.map((option) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [name, UtilityOptionComponent, Icon] = option;

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
            <ListItemButton>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={t(`optionsLabels.${name}`)} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </DisplayOptionsList>
  );
};
