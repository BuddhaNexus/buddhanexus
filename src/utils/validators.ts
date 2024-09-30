import { DbViewEnum, DEFAULT_DB_VIEW, SourceLanguage } from "./constants";

export const isValidDbView = (view: unknown): view is DbViewEnum =>
  Object.values(DbViewEnum).some((item) => item === view);

export const getValidDbView = (view: unknown) => {
  return isValidDbView(view) ? view : DEFAULT_DB_VIEW;
};

export const isValidDbLanguage = (lang: unknown): lang is SourceLanguage =>
  Object.values(SourceLanguage).some((item) => item === lang);

export const getValidDbLanguage = (lang: unknown) => {
  if (!isValidDbLanguage(lang)) {
    throw new Error(
      `Invalid language: ${lang}. Valid languages are: ${Object.values(
        SourceLanguage,
      )}`,
    );
  }

  return lang;
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
