import { FilterUISettings } from "@features/sidebarSuite/types";
import {
  parseAsJson,
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
  parseAsArrayOf,
  useQueryState,
} from "nuqs";
import {
  allUIComponentParamNames,
  DEFAULT_PARAM_VALUES,
  sortMethods,
} from "@features/sidebarSuite/uiSettingsDefinition";
import { useDbRouterParams } from "./useDbRouterParams";
import { dbLanguages } from "@utils/api/constants";

export const useScoreParam = () => {
  return useQueryState(allUIComponentParamNames.score, {
    ...parseAsInteger.withDefault(DEFAULT_PARAM_VALUES.score),
    clearOnDefault: true,
  });
};

export const useParLengthParam = () => {
  const { dbLanguage } = useDbRouterParams();
  return useQueryState(allUIComponentParamNames.par_length, {
    ...parseAsInteger.withDefault(DEFAULT_PARAM_VALUES.par_length[dbLanguage]),
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

const parseAsDbLanguage = parseAsStringLiteral(dbLanguages);

export const useLanguageParam = () => {
  return useQueryState(allUIComponentParamNames.languages, {
    ...parseAsDbLanguage,
    clearOnDefault: true,
  });
};

export const useLanguagesParam = () => {
  return useQueryState(allUIComponentParamNames.languages, {
    ...parseAsArrayOf(parseAsDbLanguage),
    clearOnDefault: true,
  });
};

export const useActiveSegmentParam = () => {
  return useQueryState(allUIComponentParamNames.active_segment, {
    ...parseAsString,
    clearOnDefault: true,
  });
};

const parseAsSortMethod = parseAsStringLiteral(sortMethods);

export const useSortMethodParam = () => {
  return useQueryState(allUIComponentParamNames.sort_method, {
    ...parseAsSortMethod.withDefault(DEFAULT_PARAM_VALUES.sort_method),
    clearOnDefault: true,
  });
};

export const useFolioParam = () => {
  return useQueryState(allUIComponentParamNames.folio, {
    ...parseAsString,
    clearOnDefault: true,
  });
};

export const useSearchStringParam = () => {
  return useQueryState(allUIComponentParamNames.search_string, {
    ...parseAsString,
    clearOnDefault: true,
  });
};
