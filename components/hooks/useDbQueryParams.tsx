import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useSearchParams } from "@components/hooks/useTypedSearchParams";
import { removeDynamicRouteParams } from "features/sidebarSuite/common/dbSidebarHelpers";
import {
  DEFAULT_PAR_LENGTH_VALUES,
  DEFAULT_QUERY_PARAMS_VALUES,
  MIN_PAR_LENGTH_VALUES,
  SETTINGS_OMISSIONS_CONFIG,
} from "features/sidebarSuite/config";
import {
  settingEnums,
  settingsList,
} from "features/sidebarSuite/config/composits";
import type { SourceLanguage } from "utils/constants";

export const useDbQueryParams = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { file, language } = router.query;

  const sourceLanguage = language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);
  const fileName = file as string;

  const queryParams = removeDynamicRouteParams({ route: router.route, params });

  const defaultQueryParams = {
    score: DEFAULT_QUERY_PARAMS_VALUES.score,
    par_length: sourceLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]
      : DEFAULT_QUERY_PARAMS_VALUES.par_length,
  };

  const parLengthConfig = {
    default: sourceLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]
      : DEFAULT_QUERY_PARAMS_VALUES.par_length,
    min: sourceLanguage
      ? MIN_PAR_LENGTH_VALUES[sourceLanguage]
      : MIN_PAR_LENGTH_VALUES.chn,
  };

  const sortParam = queryParams.get(settingsList.queryParams.sortMethod);
  const sortMethodSelectConfig = sortParam ?? "position";

  return {
    sourceLanguage,
    sourceLanguageName,
    fileName,
    queryParams: Object.fromEntries(queryParams.entries()),
    defaultQueryParams,
    defaultParamConfig: DEFAULT_QUERY_PARAMS_VALUES,
    parLengthConfig,
    sortMethodSelectConfig,
    settingEnums,
    settingsList,
    settingsOmissionsConfig: SETTINGS_OMISSIONS_CONFIG,
  };
};
