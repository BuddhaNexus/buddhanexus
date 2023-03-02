import React from "react";
import { currentDbViewAtom } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { List, ListItem } from "@mui/material";
import {
  InclusionExclusionFilters,
  MinMatchLengthFilter,
} from "features/sidebar/settingComponents";
import { StandinSetting } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import {
  type Filter,
  FILTER_CONTEXT_OMISSIONS as omissions,
  isSettingOmitted,
} from "utils/dbSidebar";

const filterComponents: [Filter, React.ElementType][] = [
  ["co_occ", () => <span />],
  ["par_length", MinMatchLengthFilter],
  ["limit_collection", InclusionExclusionFilters],
  ["score", () => <span />],
  ["target_collection", () => StandinSetting("target_collection")],
];

export const FilterSettings = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);
  const { sourceLanguage } = useDbQueryParams();

  const listItems = React.Children.toArray(
    filterComponents.map((filter) => {
      const [name, FilterComponent] = filter;

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
      // TODO: REMOVE LEGACY FILTERS ON CONFIRMATION
      if (name === "co_occ" || name === "score") {
        return null;
      }

      return (
        <ListItem>
          <FilterComponent />
        </ListItem>
      );
    })
  );

  return listItems.length > 0 ? <List>{listItems}</List> : null;
};
