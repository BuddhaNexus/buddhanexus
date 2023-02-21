import React from "react";
import { currentDbViewAtom } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { List, ListItem } from "@mui/material";
import {
  InclusionExclusionFilters,
  MinMatchLengthFilter,
} from "features/sidebar/settingComponents";
import { isNullOnly, StandinFilter } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import { type Filter, FILTERS } from "utils/dbUISettings";

const filterComponents: [Filter, React.ElementType][] = [
  ["co_occ", () => <span />],
  ["par_length", MinMatchLengthFilter],
  ["limit_collection", InclusionExclusionFilters],
  ["score", () => <span />],
  ["target_collection", () => StandinFilter("target_collection")],
];

type Props = {
  children: React.ReactNode;
};

const FilterList: React.FC<Props> = ({ children }) => {
  if (isNullOnly(children as (React.ReactNode | null)[])) {
    return null;
  }
  return <List>{children}</List>;
};

export const FilterSettings = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);
  const { sourceLanguage } = useDbQueryParams();

  return (
    <FilterList>
      {filterComponents.map((filter) => {
        const [name, FilterComponent] = filter;

        if (!FILTERS[name].views.includes(currentDbView)) {
          return null;
        }
        if (!FILTERS[name].langs.includes(sourceLanguage)) {
          return null;
        }
        // TODO: REMOVE LEGACY FILTERS ON CONFIRMATION
        if (name === "co_occ" || name === "score") {
          return null;
        }

        return (
          <ListItem key={name}>
            <FilterComponent />
          </ListItem>
        );
      })}
    </FilterList>
  );
};
