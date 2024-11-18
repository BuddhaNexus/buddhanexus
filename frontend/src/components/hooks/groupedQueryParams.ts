import {
  nullToUndefined,
  useExcludeCategoriesParam,
  useExcludeCollectionsParam,
  useExcludeFilesParam,
  useFolioParam,
  useIncludeCategoriesParam,
  useIncludeCollectionsParam,
  useIncludeFilesParam,
  useLanguageParam,
  useLanguagesParam,
  useParLengthParam,
  useScoreParam,
} from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { AllAPIRequestProps } from "@utils/api/types";

export const useDbQueryFilters = () => {
  const [score] = useScoreParam();
  const [par_length] = useParLengthParam();
  const [exclude_collections] = useExcludeCollectionsParam();
  const [exclude_categories] = useExcludeCategoriesParam();
  const [exclude_files] = useExcludeFilesParam();
  const [include_collections] = useIncludeCollectionsParam();
  const [include_categories] = useIncludeCategoriesParam();
  const [include_files] = useIncludeFilesParam();
  const [language] = useLanguageParam();
  const [languages] = useLanguagesParam();

  const filters: AllAPIRequestProps["filters"] = {
    score,
    par_length,
    exclude_collections: nullToUndefined(exclude_collections),
    exclude_categories: nullToUndefined(exclude_categories),
    exclude_files: nullToUndefined(exclude_files),
    include_collections: nullToUndefined(include_collections),
    include_categories: nullToUndefined(include_categories),
    include_files: nullToUndefined(include_files),
    languages: nullToUndefined(languages),
    language,
  };

  return filters;
};

export const useStandardViewBaseQueryParams = () => {
  /** For Text Table, and Numbers view queries.
   * text: + active_segment
   * table & numbers: + sort_method
   */

  const { fileName: filename } = useDbRouterParams();
  const [folio] = useFolioParam();

  return {
    filename,
    folio: nullToUndefined(folio) ?? "",
    filters: useDbQueryFilters(),
  };
};
