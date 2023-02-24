import React from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Divider, List, ListItem, Typography } from "@mui/material";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import { StandinFilter } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import {
  DISPLAY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type DisplayOption,
  isSettingOmitted,
} from "utils/dbUISettings";

const displayOptionComponents: [DisplayOption, React.ElementType][] = [
  ["script", TextScriptOption],
  ["folio", FolioOption],
  ["multi_lingual", () => StandinFilter("multi_lingual")],
  [
    "showAndPositionSegmentNrs",
    () => StandinFilter("showAndPositionSegmentNrs"),
  ],
  ["sort_method", SortOption],
];

export const DisplayOptionsSection = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);
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
          view: currentDbView,
        })
      ) {
        return null;
      }

      return (
        <ListItem key={name}>
          <DisplayOptionComponent />
        </ListItem>
      );
    })
  );

  return listItems.length > 0 ? (
    <>
      <Typography variant="h6" mx={2}>
        {t("headings.display")}
      </Typography>
      <List>{listItems}</List>
      <Divider sx={{ my: 2 }} />
    </>
  ) : null;
};
