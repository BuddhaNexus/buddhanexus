import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { currentViewAtom } from "features/atoms";
import { DbViewEnum } from "features/sidebarSuite/config/types";
import { useSetAtom } from "jotai";

import { useDbQueryParams } from "./useDbQueryParams";

export const isValideView = (view: unknown): view is DbViewEnum =>
  Object.values(DbViewEnum).some((item) => item === view);

export const getSafeView = (view: unknown) => {
  return isValideView(view) ? view : DbViewEnum.TEXT;
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
  const pathnameView = pathnameParts.at(-1) ?? DbViewEnum.TEXT;

  useEffect(() => {
    setCurrentView(getSafeView(pathnameView));
  }, [pathnameView, setCurrentView]);
};
