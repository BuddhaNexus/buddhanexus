import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { currentDbViewAtom } from "@atoms";
import { DbViewEnum, DEFAULT_DB_VIEW, SourceLanguage } from "@utils/constants";
import { getValidDbView } from "@utils/validators";
import { useSetAtom } from "jotai";

import { useDbRouterParams } from "./useDbRouterParams";

export const UNAVAILABLE_VIEWS: Partial<Record<SourceLanguage, DbViewEnum[]>> =
  {
    [SourceLanguage.SANSKRIT]: [DbViewEnum.NUMBERS],
    [SourceLanguage.TIBETAN]: [DbViewEnum.NUMBERS],
  };

export const getAvailableDBViews = (language: SourceLanguage) => {
  const allViews = Object.values(DbViewEnum);
  const unavailableDbViews = UNAVAILABLE_VIEWS[language];

  if (!unavailableDbViews) return allViews;

  return allViews.filter((view) => !unavailableDbViews.includes(view));
};

export const useAvailableDbViews = () => {
  const { sourceLanguage } = useDbRouterParams();

  return useMemo(() => {
    return getAvailableDBViews(sourceLanguage);
  }, [sourceLanguage]);
};

// This allows two-way view setting: url <--> view selector
export const useSetDbViewFromPath = () => {
  const { pathname } = useRouter();
  const setCurrentView = useSetAtom(currentDbViewAtom);

  const pathnameParts = pathname.split("/");
  const pathnameView = pathnameParts.at(-1) ?? DEFAULT_DB_VIEW;

  useEffect(() => {
    setCurrentView(getValidDbView(pathnameView));
  }, [pathnameView, setCurrentView]);
};
