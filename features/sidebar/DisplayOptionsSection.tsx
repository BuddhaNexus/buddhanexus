import React from "react";
import { useTranslation } from "next-i18next";
import {
  currentDbViewAtom,
  DbViewSelector,
} from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import { StandinSetting } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import {
  DISPLAY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type DisplayOption,
  isSettingOmitted,
} from "utils/dbSidebar";

const displayOptionComponents: [DisplayOption, React.ElementType][] = [
  ["script", TextScriptOption],
  ["folio", FolioOption],
  ["multi_lingual", () => StandinSetting("multi_lingual")],
  [
    "showAndPositionSegmentNrs",
    () => StandinSetting("showAndPositionSegmentNrs"),
  ],
  ["sort_method", SortOption],
];

export const DisplayOptionsSection = () => {
  const currentView = useAtomValue(currentDbViewAtom);
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");

  const listItems = React.Children.toArray(
    displayOptionComponents.map((option) => {
      const [name, DisplayOptionComponent] = option;

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

      return (
        <ListItem key={name} sx={{ px: 0 }}>
          <DisplayOptionComponent />
        </ListItem>
      );
    })
  );

  return listItems.length > 0 ? (
    <Box sx={{ mx: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        {t("headings.display")}
      </Typography>
      <DbViewSelector currentView={currentView} />
      <List>{listItems}</List>
      <Divider sx={{ my: 2 }} />
    </Box>
  ) : null;
};
