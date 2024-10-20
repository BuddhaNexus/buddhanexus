import {
  useExcludeCategoriesParam,
  useExcludeCollectionsParam,
  useExcludeFilesParam,
  useFolioParam,
  useIncludeCategoriesParam,
  useIncludeCollectionsParam,
  useIncludeFilesParam,
  useParLengthParam,
  useScoreParam,
} from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { AllAPIRequestProps } from "@utils/api/types";

const nullToUndefined = <T>(value: T | null): T | undefined => {
  return value === null ? undefined : value;
};
const nullToArray = <T>(value: T | null): T | [] => {
  return value === null ? [] : value;
};

export const useDbQueryFilters = () => {
  const [score] = useScoreParam();
  const [par_length] = useParLengthParam();
  const [exclude_collections] = useExcludeCollectionsParam();
  const [exclude_categories] = useExcludeCategoriesParam();
  const [exclude_files] = useExcludeFilesParam();
  const [include_collections] = useIncludeCollectionsParam();
  const [include_categories] = useIncludeCategoriesParam();
  const [include_files] = useIncludeFilesParam();

  const filters: AllAPIRequestProps["filters"] = {
    score,
    par_length,
    exclude_collections: nullToArray(exclude_collections),
    exclude_categories: nullToArray(exclude_categories),
    exclude_files: nullToArray(exclude_files),
    include_collections: nullToArray(include_collections),
    include_categories: nullToArray(include_categories),
    include_files: nullToArray(include_files),
    languages: ["all"],
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
