import { FilterUISettings } from "@features/sidebarSuite/types";
import {
  parseAsJson,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  useQueryState,
} from "nuqs";
import {
  allUIComponentParamNames,
  DEFAULT_PAR_LENGTH_VALUES,
} from "@features/sidebarSuite/uiSettingsDefinition";
import { useDbRouterParams } from "../useDbRouterParams";

export const useFilterParam = () => {
  return useQueryState(
    allUIComponentParamNames.filters,
    parseAsJson<FilterUISettings>()
  );
};

export const useScoreParam = () => {
  return useQueryState(allUIComponentParamNames.score, {
    ...parseAsInteger.withDefault(30),
    clearOnDefault: true,
  });
};

export const useParLengthParam = () => {
  const { dbLanguage } = useDbRouterParams();
  return useQueryState(allUIComponentParamNames.par_length, {
    ...parseAsInteger.withDefault(DEFAULT_PAR_LENGTH_VALUES[dbLanguage]),
    clearOnDefault: true,
  });
};

export const useExcludeCollectionsParam = () => {
  return useQueryState(allUIComponentParamNames.exclude_collections, {
    ...parseAsArrayOf(parseAsString),
    clearOnDefault: true,
  });
};

export const useExcludeCategoriesParam = () => {
  return useQueryState(allUIComponentParamNames.exclude_categories, {
    ...parseAsArrayOf(parseAsString),
    clearOnDefault: true,
  });
};

export const useExcludeFilesParam = () => {
  return useQueryState(allUIComponentParamNames.exclude_files, {
    ...parseAsArrayOf(parseAsString),
    clearOnDefault: true,
  });
};

export const useIncludeCollectionsParam = () => {
  return useQueryState(allUIComponentParamNames.include_collections, {
    ...parseAsArrayOf(parseAsString),
    clearOnDefault: true,
  });
};

export const useIncludeCategoriesParam = () => {
  return useQueryState(allUIComponentParamNames.include_categories, {
    ...parseAsArrayOf(parseAsString),
    clearOnDefault: true,
  });
};

export const useIncludeFilesParam = () => {
  return useQueryState(allUIComponentParamNames.include_files, {
    ...parseAsArrayOf(parseAsString),
    clearOnDefault: true,
  });
};

export const useLanguagesParam = () => {
  return useQueryState(allUIComponentParamNames.languages, {
    ...parseAsArrayOf(parseAsString),
    clearOnDefault: true,
  });
};
