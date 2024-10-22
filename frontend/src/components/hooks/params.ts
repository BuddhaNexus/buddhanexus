import {
  allUIComponentParamNames,
  DEFAULT_PARAM_VALUES,
  sortMethods,
} from "@features/SidebarSuite/uiSettings/config";
import { dbLanguages } from "@utils/api/constants";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";

import { useNullableDbRouterParams } from "./useDbRouterParams";

export const nullToUndefined = <T>(value: T | null): T | undefined => {
  return value ?? undefined;
};

export const useScoreParam = () => {
  return useQueryState(allUIComponentParamNames.score, {
    ...parseAsInteger.withDefault(DEFAULT_PARAM_VALUES.score),
    clearOnDefault: true,
  });
};

export const useParLengthParam = () => {
  const { dbLanguage } = useNullableDbRouterParams();
  return useQueryState(allUIComponentParamNames.par_length, {
    ...parseAsInteger.withDefault(
      DEFAULT_PARAM_VALUES.par_length[dbLanguage ?? "all"],
    ),
    clearOnDefault: true,
  });
};

export const useExcludeCollectionsParam = () => {
  return useQueryState(allUIComponentParamNames.exclude_collections, {
    ...parseAsArrayOf(parseAsString).withDefault([]),
    clearOnDefault: true,
  });
};

export const useExcludeCategoriesParam = () => {
  return useQueryState(allUIComponentParamNames.exclude_categories, {
    ...parseAsArrayOf(parseAsString).withDefault([]),
    clearOnDefault: true,
  });
};

export const useExcludeFilesParam = () => {
  return useQueryState(allUIComponentParamNames.exclude_files, {
    ...parseAsArrayOf(parseAsString).withDefault([]),
    clearOnDefault: true,
  });
};

export const useIncludeCollectionsParam = () => {
  return useQueryState(allUIComponentParamNames.include_collections, {
    ...parseAsArrayOf(parseAsString).withDefault([]),
    clearOnDefault: true,
  });
};

export const useIncludeCategoriesParam = () => {
  return useQueryState(allUIComponentParamNames.include_categories, {
    ...parseAsArrayOf(parseAsString).withDefault([]),
    clearOnDefault: true,
  });
};

export const useIncludeFilesParam = () => {
  return useQueryState(allUIComponentParamNames.include_files, {
    ...parseAsArrayOf(parseAsString).withDefault([]),
    clearOnDefault: true,
  });
};

const parseAsDbLanguage = parseAsStringLiteral([
  ...dbLanguages,
  DEFAULT_PARAM_VALUES.language,
]);

export const useLanguageParam = () => {
  return useQueryState(allUIComponentParamNames.languages, {
    ...parseAsDbLanguage.withDefault(DEFAULT_PARAM_VALUES.language),
    clearOnDefault: true,
  });
};

export const useLanguagesParam = () => {
  return useQueryState(allUIComponentParamNames.languages, {
    ...parseAsArrayOf(parseAsDbLanguage).withDefault([]),
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
    ...parseAsString.withDefault(""),
    clearOnDefault: true,
  });
};
