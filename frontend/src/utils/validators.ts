import { SortMethod } from "@features/SidebarSuite/types";
import {
  DEFAULT_PARAM_VALUES,
  sortMethods,
} from "@features/SidebarSuite/uiSettings/config";
import { DbLanguage, dbLanguages } from "@utils/api/constants";
import { APISchemas, CustomAPIError } from "@utils/api/types";
import { DbViewEnum, DEFAULT_DB_VIEW } from "@utils/constants";

export const isValidDbView = (view: unknown): view is DbViewEnum =>
  Object.values(DbViewEnum).some((item) => item === view);

export const getValidDbView = (view: unknown) => {
  return isValidDbView(view) ? view : DEFAULT_DB_VIEW;
};

export const isValidDbLanguage = (lang: unknown): lang is DbLanguage =>
  dbLanguages.some((item) => item === lang);

export const getDbLanguage = (lang: unknown) => {
  return isValidDbLanguage(lang) ? lang : undefined;
};

export const getValidDbLanguage = (lang: unknown) => {
  if (!isValidDbLanguage(lang)) {
    throw new Error(
      `Invalid language: ${lang}. Valid languages are: ${dbLanguages.join(", ")}.`,
    );
  }

  return lang;
};

export const isValidSortMethod = (method: unknown): method is SortMethod =>
  sortMethods.some((item) => item === method);

export const getValidSortMethod = (method: unknown) => {
  return isValidSortMethod(method) ? method : DEFAULT_PARAM_VALUES.sort_method;
};

export const isCustomAPIError = (error: unknown): error is CustomAPIError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "errorMessage" in error
  );
};

const downloadViews: APISchemas["DownloadData"][] = ["numbers", "table"];

export function isValidDownloadView(
  value: string,
): value is APISchemas["DownloadData"] {
  return downloadViews.some((view) => view === value);
}
