import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { currentDbViewAtom } from "@atoms";
import { DbLanguage } from "@utils/api/types";
import { DbViewEnum, DEFAULT_DB_VIEW } from "@utils/constants";
import { getValidDbView } from "@utils/validators";
import { useSetAtom } from "jotai";

import { useDbPageRouterParams } from "./useDbRouterParams";

export const UNAVAILABLE_VIEWS: Partial<Record<DbLanguage, DbViewEnum[]>> = {
  sa: [DbViewEnum.NUMBERS],
  bo: [DbViewEnum.NUMBERS],
};

export const getAvailableDBViews = (language: DbLanguage) => {
  const allViews = Object.values(DbViewEnum);
  const unavailableDbViews = UNAVAILABLE_VIEWS[language];

  if (!unavailableDbViews) return allViews;

  return allViews.filter((view) => !unavailableDbViews.includes(view));
};

export const useAvailableDbViews = () => {
  const { dbLanguage } = useDbPageRouterParams();

  return useMemo(() => {
    return getAvailableDBViews(dbLanguage);
  }, [dbLanguage]);
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
