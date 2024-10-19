import { useSearchParams } from "next/navigation";
import {
  DEFAULT_PAR_LENGTH_VALUES,
  DEFAULT_QUERY_PARAMS_VALUES,
  MIN_PAR_LENGTH_VALUES,
} from "@features/sidebarSuite/config";
import { allUIComponentParamNames } from "@features/sidebarSuite/uiSettingsDefinition";

import { useDbRouterParams } from "./useDbRouterParams";

export const useDbQueryParams = () => {
  const { dbLanguage } = useDbRouterParams();
  const searchParams = useSearchParams();
  // TODO: See default params need to be set here
  const defaultQueryParams: DefaultQueryParams = {
    score: DEFAULT_QUERY_PARAMS_VALUES.score,
    par_length: dbLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[dbLanguage]
      : DEFAULT_QUERY_PARAMS_VALUES.par_length,
    multi_lingual: DEFAULT_QUERY_PARAMS_VALUES.multi_lingual,
    sort_method: DEFAULT_QUERY_PARAMS_VALUES.sort_method,
  };

  // Chinese is used as fallback min par length as it has the lowest min par length value.
  const parLengthConfig = {
    default: dbLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[dbLanguage]
      : DEFAULT_QUERY_PARAMS_VALUES.par_length,
    min: dbLanguage
      ? MIN_PAR_LENGTH_VALUES[dbLanguage]
      : MIN_PAR_LENGTH_VALUES.chn,
  };

  const queryParamsMap = new URLSearchParams(searchParams);
  // Remove NextJS dynamic route param. The file name is already given in the url & `file` cannot be used to query the API.
  queryParamsMap.delete("file");

  const sortParam = queryParamsMap.get(allUIComponentParamNames.sort_method);
  const sortMethodSelectValue = sortParam ?? "position";

  return {
    queryParams: Object.fromEntries(queryParamsMap.entries()),
    defaultQueryParams,
    defaultParamConfig: DEFAULT_QUERY_PARAMS_VALUES,
    parLengthConfig,
    sortMethodSelectValue,
  };
};
