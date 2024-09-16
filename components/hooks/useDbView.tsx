import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { currentViewAtom } from "features/atoms";
import { DbViewEnum } from "features/sidebarSuite/config/types";
import { useSetAtom } from "jotai";

import { useDbQueryParams } from "./useDbQueryParams";

export { DbViewEnum } from "features/sidebarSuite/config/types";
export const defaultDBView = DbViewEnum.TEXT;

export const isValidView = (view: unknown): view is DbViewEnum =>
  Object.values(DbViewEnum).some((item) => item === view);

export const getValidView = (view: unknown) => {
  return isValidView(view) ? view : defaultDBView;
};

export const useAvailableDbViews = () => {
  const {
    sourceLanguage,
    settingsOmissionsConfig: { viewSelector: omittedViews },
  } = useDbQueryParams();

  return useMemo(() => {
    const allViews = Object.values(DbViewEnum);
    const unavailableViews = omittedViews[sourceLanguage];

    if (!unavailableViews) return allViews;

    return allViews.filter((view) => !unavailableViews.includes(view));
  }, [omittedViews, sourceLanguage]);
};

// This allows two-way view setting: url <--> view selector
export const useSetDbViewFromPath = () => {
  const { pathname } = useRouter();
  const setCurrentView = useSetAtom(currentViewAtom);

  const pathnameParts = pathname.split("/");
  const pathnameView = pathnameParts.at(-1) ?? defaultDBView;

  useEffect(() => {
    setCurrentView(getValidView(pathnameView));
  }, [pathnameView, setCurrentView]);
};
