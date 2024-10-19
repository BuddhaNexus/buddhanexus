import { DbViewEnum, DEFAULT_DB_VIEW } from "./constants";

import { DbLanguage, dbLanguages } from "./api/constants";
import {
  sortMethods,
  DEFAULT_PARAM_VALUES,
} from "@features/sidebarSuite/uiSettingsDefinition";
import { SortMethod } from "@features/sidebarSuite/types";

export const isValidDbView = (view: unknown): view is DbViewEnum =>
  Object.values(DbViewEnum).some((item) => item === view);

export const getValidDbView = (view: unknown) => {
  return isValidDbView(view) ? view : DEFAULT_DB_VIEW;
};

export const isValidDbLanguage = (lang: unknown): lang is DbLanguage =>
  dbLanguages.some((item) => item === lang);

export const getValidDbLanguage = (lang: unknown) => {
  if (!isValidDbLanguage(lang)) {
    throw new Error(
      `Invalid language: ${lang}. Valid languages are: ${dbLanguages.join(", ")}`
    );
  }

  return lang;
};

export const isValidSortMethod = (method: unknown): method is SortMethod =>
  sortMethods.some((item) => item === method);

export const getValidSortMethod = (method: unknown) => {
  return isValidSortMethod(method) ? method : DEFAULT_PARAM_VALUES.sort_method;
};

type AtLeastOne<T> = [T, ...T[]];

// https://github.com/microsoft/TypeScript/issues/53171
// https://stackoverflow.com/a/55266531/7794529
export const exhaustiveStringTuple =
  <T extends string>() =>
  <L extends AtLeastOne<T>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...x: L extends any
      ? Exclude<T, L[number]> extends never
        ? L
        : Exclude<T, L[number]>[]
      : never
  ) =>
    x;
