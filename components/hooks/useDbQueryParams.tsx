import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useSearchParams } from "@components/hooks/useTypedSearchParams";
import { defaultSourceLanguagesSelection } from "features/atoms";
import { getQueryParamsFromRouter } from "features/sidebarSuite/common/dbSidebarHelpers";
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
import { useAtomValue } from "jotai";
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

  const queryParams = getQueryParamsFromRouter({ route: router.route, params });
  const multiLingualParamDefault = useAtomValue(
    defaultSourceLanguagesSelection
  );

  const defaultQueryParams = {
    score: DEFAULT_QUERY_PARAMS_VALUES.score,
    par_length: sourceLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]
      : DEFAULT_QUERY_PARAMS_VALUES.par_length,
    multi_lingual: multiLingualParamDefault.join(","),
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

  const sortParam = queryParams.get(uniqueSettings.queryParams.sortMethod);
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
    settingRenderGroups,
    uniqueSettings,
    settingsOmissionsConfig: SETTINGS_OMISSIONS_CONFIG,
  };
};
