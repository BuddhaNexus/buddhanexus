import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { filterConfig } from "features/sidebar/queryParams";
import queryString from "query-string";
import { useQueryParams } from "use-query-params";
import type { SourceLanguage } from "utils/constants";

export const useDbQueryParams = () => {
  const { query } = useRouter();
  const { t } = useTranslation();

  const sourceLanguage = query.language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);

  const fileName = query.file as string;

  const [queryParams, setQueryParams] = useQueryParams(filterConfig);

  const serializedParams = queryString.stringify(queryParams);

  return {
    sourceLanguage,
    sourceLanguageName,
    fileName,
    queryParams,
    setQueryParams,
    serializedParams,
  };
};
