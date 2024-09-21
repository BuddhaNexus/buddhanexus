import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom, DbViewEnum } from "@components/hooks/useDbView";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useAtom } from "jotai";

export const DbViewSelector = () => {
  const { t } = useTranslation("settings");

  const router = useRouter();

  const [currentView, setCurrentDbView] = useAtom(currentViewAtom);
  const {
    sourceLanguage,
    settingsOmissionsConfig: { viewSelector: omittedViews },
  } = useDbQueryParams();

  const availableViews = React.useMemo(() => {
    if (Object.hasOwn(omittedViews, sourceLanguage)) {
      return Object.values(DbViewEnum).filter(
        (view) => !omittedViews[sourceLanguage]!.includes(view as DbViewEnum),
      ) as DbViewEnum[];
    }
    return Object.values(DbViewEnum);
  }, [omittedViews, sourceLanguage]);

  const handleChange = async (e: SelectChangeEvent) => {
    const newView = e.target.value as DbViewEnum;
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
