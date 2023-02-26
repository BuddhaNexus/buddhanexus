import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import queryString from "query-string";
import {
  ArrayParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import type { SourceLanguage } from "utils/constants";
import { QUERY_DEFAULTS } from "utils/dbSidebar";

export const useDbQueryParams = () => {
  const { query } = useRouter();
  const { t } = useTranslation();

  const sourceLanguage = query.language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);

  const fileName = query.file as string;

  const queryConfig = {
    co_occ: withDefault(NumberParam, QUERY_DEFAULTS.co_occ),
    score: withDefault(NumberParam, QUERY_DEFAULTS.score),
    par_length: withDefault(
      NumberParam,
      QUERY_DEFAULTS.par_length[sourceLanguage]
    ),
    limit_collection: withDefault(ArrayParam, QUERY_DEFAULTS.limit_collection),
    target_collection: withDefault(
      StringParam,
      QUERY_DEFAULTS.target_collection
    ),
    folio: withDefault(StringParam, QUERY_DEFAULTS.folio),
    sort_method: withDefault(StringParam, QUERY_DEFAULTS.sort_method),
  };

  const [queryParams, setQueryParams] = useQueryParams(queryConfig);

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
