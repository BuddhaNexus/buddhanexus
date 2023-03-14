import { useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useAtomValue } from "jotai";
import _debounce from "lodash/debounce";
import queryString from "query-string";
import {
  ArrayParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from "use-query-params";
import type { SourceLanguage } from "utils/constants";
import {
  DEFAULT_PAR_LENGTH_VALUES,
  DEFAULT_QUERY_PARAMS,
  scoreFilterValueAtom,
} from "utils/dbSidebar";

const queryConfig = {
  score: NumberParam,
  par_length: NumberParam,
  limit_collection: ArrayParam,
  target_collection: StringParam,
  folio: StringParam,
  sort_method: StringParam,
};

export const useDbQueryParams = () => {
  const { query, asPath } = useRouter();
  const { t } = useTranslation();

  const sourceLanguage = query.language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);
  const fileName = query.file as string;

  const urlHasParams = asPath.includes("?");

  const [queryParams, setQueryParams] = useQueryParams(queryConfig);

  const defaultQueryParams = {
    ...DEFAULT_QUERY_PARAMS,
    par_length: DEFAULT_PAR_LENGTH_VALUES[sourceLanguage],
  };

  const scoreFilterValue = useAtomValue(scoreFilterValueAtom);

  const setDebouncedQueryParam = useMemo(
    () =>
      _debounce((param: string, value: number) => {
        const requiredQueryParams = {
          score: queryParams.score ?? scoreFilterValue,
          par_length:
            queryParams.par_length ?? DEFAULT_PAR_LENGTH_VALUES[sourceLanguage],
        };

        setQueryParams({
          ...requiredQueryParams,
          [param]: value,
        });
      }, 600),
    [
      queryParams.score,
      queryParams.par_length,
      scoreFilterValue,
      sourceLanguage,
      setQueryParams,
    ]
  );

  const serializedParams = queryString.stringify(queryParams);

  return {
    sourceLanguage,
    sourceLanguageName,
    fileName,
    urlHasParams,
    queryParams,
    setQueryParams,
    setDebouncedQueryParam,
    serializedParams,
    defaultQueryParams,
  };
};
