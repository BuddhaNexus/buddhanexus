import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useAvailableDbViews } from "@components/hooks/useDbView";
import { allUIComponentParamNames } from "@features/SidebarSuite/uiSettings/config";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { DbViewEnum } from "@utils/constants";
import { getValidDbView } from "@utils/validators";
import { useAtom } from "jotai";

const {
  exclude_collections,
  exclude_categories,
  exclude_files,
  include_categories,
  include_files,
} = allUIComponentParamNames;

const getViewQueryParams = (view: DbViewEnum) => {
  const params: URLSearchParams = new URLSearchParams(window.location.search);

  if (view === DbViewEnum.GRAPH) {
    params.delete(exclude_collections);
    params.delete(exclude_categories);
    params.delete(exclude_files);
    params.delete(include_categories);
    params.delete(include_files);
  }

  return Object.fromEntries(params);
};

export const DbViewSelector = () => {
  const { t } = useTranslation("settings");

  const router = useRouter();

  const [currentView, setCurrentDbView] = useAtom(currentDbViewAtom);

  const availableViews = useAvailableDbViews();

  const handleChange = React.useCallback(
    async (e: SelectChangeEvent) => {
      const newView = getValidDbView(e.target.value);
      const queryParams = getViewQueryParams(newView);

      const { language, file } = router.query;

      await router.push({
        pathname: router.pathname.replace(currentView, newView),
        query: { language, file, ...queryParams },
      });
      setCurrentDbView(newView);
    },
    [currentView, router, setCurrentDbView]
  );

  return (
    <FormControl variant="filled" sx={{ width: 1, mb: 2 }}>
      <InputLabel id="db-view-selector-label">
        {t(`dbViewLabels.view`)}
      </InputLabel>
      <Select
        labelId="db-view-selector-label"
        id="db-view-selector"
        aria-labelledby="db-view-selector-label"
        data-testid="db-view-selector"
        value={currentView}
        onChange={(e: SelectChangeEvent) => handleChange(e)}
      >
        {availableViews.map((view) => (
          <MenuItem key={view} value={view}>
            {t(`dbViewLabels.${view}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
