import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  DEFAULT_PAR_LENGTH_VALUES,
  DEFAULT_QUERY_PARAMS_VALUES,
  MIN_PAR_LENGTH_VALUES,
  SETTINGS_OMISSIONS_CONFIG,
} from "features/sidebarSuite/config";
import {
  settingRenderGroups,
  uniqueSettings,
} from "features/sidebarSuite/config/settings";
import type { DefaultQueryParams } from "features/sidebarSuite/config/types";
import type { SourceLanguage } from "utils/constants";

export const useDbQueryParams = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { file, language } = router.query;

  const sourceLanguage = language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);
  const fileName = file as string;

  // TODO: See default params need to be set here
  const defaultQueryParams: DefaultQueryParams = {
    score: DEFAULT_QUERY_PARAMS_VALUES.score,
    par_length: sourceLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]
      : DEFAULT_QUERY_PARAMS_VALUES.par_length,
    multi_lingual: DEFAULT_QUERY_PARAMS_VALUES.multi_lingual,
    sort_method: DEFAULT_QUERY_PARAMS_VALUES.sort_method,
  };

  // Chinese is used as fallback min par length as it has the lowest min par length value.
  const parLengthConfig = {
    default: sourceLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]
      : DEFAULT_QUERY_PARAMS_VALUES.par_length,
    min: sourceLanguage
      ? MIN_PAR_LENGTH_VALUES[sourceLanguage]
      : MIN_PAR_LENGTH_VALUES.chn,
  };

  const queryParams = new URLSearchParams(searchParams);
  // Remove NextJS dynamic route param. The file name is already given in the url & `file` cannot be used to query the API.
  queryParams.delete("file");

  const sortParam = queryParams.get(uniqueSettings.queryParams.sortMethod);
  const sortMethodSelectValue = sortParam ?? "position";

  return {
    sourceLanguage,
    sourceLanguageName,
    fileName,
    queryParams: Object.fromEntries(queryParams.entries()),
    defaultQueryParams,
    defaultParamConfig: DEFAULT_QUERY_PARAMS_VALUES,
    parLengthConfig,
    sortMethodSelectValue,
    settingRenderGroups,
    uniqueSettings,
    settingsOmissionsConfig: SETTINGS_OMISSIONS_CONFIG,
  };
};
