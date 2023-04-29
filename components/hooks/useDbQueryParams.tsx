import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  DEFAULT_PAR_LENGTH_VALUES,
  DEFAULT_QUERY_PARAMS,
} from "features/sidebar/common/dbSidebarSettings";
import queryString from "query-string";
import type { SourceLanguage } from "utils/constants";

export const useDbQueryParams = () => {
  const { query } = useRouter();
  const { t } = useTranslation();

  const sourceLanguage = query.language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);
  const fileName = query.file as string;

  const defaultQueryParams = {
    score: DEFAULT_QUERY_PARAMS.score,
    par_length: DEFAULT_PAR_LENGTH_VALUES[sourceLanguage],
  };

  const serializedParams = queryString.stringify(query);

  return {
    sourceLanguage,
    sourceLanguageName,
    fileName,
    serializedParams,
    defaultQueryParams,
  };
};
