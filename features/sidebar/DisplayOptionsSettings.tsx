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
import { isNullOnly, StandinFilter } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import { DISPLAY_OPTIONS, type DisplayOption } from "utils/dbUISettings";

const displayOptionComponents: [DisplayOption, React.ElementType][] = [
  ["folio", FolioOption],
  ["multi_lingual", () => StandinFilter("showAndPositionSegmentNrs")],
  ["script", TextScriptOption],
  [
    "showAndPositionSegmentNrs",
    () => StandinFilter("showAndPositionSegmentNrs"),
  ],
  ["sort_method", SortOption],
];

type Props = {
  children: React.ReactNode;
};

const DisplayOptionsList: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();

  if (isNullOnly(children as (React.ReactNode | null)[])) {
    return null;
  }

  return (
    <>
      <Typography variant="h6" mx={2}>
        {t("settings:headings.display")}
      </Typography>
      <List>{children}</List>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

export const DisplayOptionsSettings = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);
  const { sourceLanguage } = useDbQueryParams();

  return (
    <DisplayOptionsList>
      {displayOptionComponents.map((option) => {
        const [name, DisplayOptionComponent] = option;
        if (!DISPLAY_OPTIONS[name].views.includes(currentDbView)) {
          return null;
        }
        if (!DISPLAY_OPTIONS[name].langs.includes(sourceLanguage)) {
          return null;
        }

        return (
          <ListItem key={name}>
            <DisplayOptionComponent />
          </ListItem>
        );
      })}
    </DisplayOptionsList>
  );
};
