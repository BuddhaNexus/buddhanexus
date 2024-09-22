import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { currentViewAtom } from "@features/atoms";
import { SETTINGS_OMISSIONS_CONFIG } from "@features/sidebarSuite/config";
import { DbViewEnum, DEFAULT_DB_VIEW, SourceLanguage } from "@utils/constants";
import { getValidDbView } from "@utils/validators";
import { useSetAtom } from "jotai";

import { useDbQueryParams } from "./useDbQueryParams";

const { viewSelector: omittedViews } = SETTINGS_OMISSIONS_CONFIG;

export const getAvailableDBViews = (language: SourceLanguage) => {
  const allViews = Object.values(DbViewEnum);
  const unavailableViews = omittedViews[language];

  if (!unavailableViews) return allViews;

  return allViews.filter((view) => !unavailableViews.includes(view));
};

export const useAvailableDbViews = () => {
  const { sourceLanguage } = useDbQueryParams();

  return useMemo(() => {
    return getAvailableDBViews(sourceLanguage);
  }, [sourceLanguage]);
};

// This allows two-way view setting: url <--> view selector
export const useSetDbViewFromPath = () => {
  const { pathname } = useRouter();
  const setCurrentView = useSetAtom(currentViewAtom);

  const pathnameParts = pathname.split("/");
  const pathnameView = pathnameParts.at(-1) ?? DEFAULT_DB_VIEW;

  useEffect(() => {
    setCurrentView(getValidDbView(pathnameView));
  }, [pathnameView, setCurrentView]);
};
