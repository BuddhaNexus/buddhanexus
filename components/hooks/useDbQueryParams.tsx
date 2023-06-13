import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  DB_PAGE_FILTER_OMISSIONS_CONFIG,
  DEFAULT_PAR_LENGTH_VALUES,
  DEFAULT_QUERY_PARAMS,
  MIN_PAR_LENGTH_VALUES,
  settingEnums,
  settingsList,
} from "features/sidebarSuite/common/dbSidebarSettings";
import type { SourceLanguage } from "utils/constants";

export const useDbQueryParams = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { language, file, ...queryParams } = query;

  const sourceLanguage = language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);
  const fileName = file as string;

  const defaultQueryParams = {
    score: DEFAULT_QUERY_PARAMS.score,
    par_length: sourceLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]
      : DEFAULT_QUERY_PARAMS.par_length,
  };

  const parLengthConfig = {
    default: sourceLanguage
      ? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]
      : DEFAULT_QUERY_PARAMS.par_length,
    min: sourceLanguage
      ? MIN_PAR_LENGTH_VALUES[sourceLanguage]
      : MIN_PAR_LENGTH_VALUES.chn,
  };

  return {
    sourceLanguage,
    sourceLanguageName,
    fileName,
    queryParams,
    defaultQueryParams,
    defaultParamConfig: DEFAULT_QUERY_PARAMS,
    parLengthConfig,
    settingEnums,
    settingsList,
    filterOmissionsConfig: DB_PAGE_FILTER_OMISSIONS_CONFIG,
  };
};
