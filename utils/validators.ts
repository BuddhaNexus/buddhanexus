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
