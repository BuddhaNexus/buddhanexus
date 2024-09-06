import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getSafeView, useAvailableDbViews } from "@components/hooks/useDbView";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { currentViewAtom } from "features/atoms";
import { useAtom } from "jotai";

export const DbViewSelector = () => {
  const { t } = useTranslation("settings");

  const router = useRouter();

  const [currentView, setCurrentDbView] = useAtom(currentViewAtom);

  const availableViews = useAvailableDbViews();

  const handleChange = async (e: SelectChangeEvent) => {
    const newView = getSafeView(e.target.value);
    await router.push({
      pathname: router.pathname.replace(currentView, newView),
      query: { ...router.query },
    });
    setCurrentDbView(newView);
  };

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
