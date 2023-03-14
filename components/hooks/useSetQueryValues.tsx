import { useCallback } from "react";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";
import type { CategoryMenuItem, TextMenuItem } from "utils/api/textLists";
import type { DbLang } from "utils/dbSidebar";
import {
  DEFAULT_PAR_LENGTH_VALUES,
  DEFAULT_QUERY_VALUES,
  folioOptionValueAtom,
  limitCollectionFilterValueAtom,
  parLengthFilterValueAtom,
  type QueryValues,
  scoreFilterValueAtom,
  sortMethodOptionValueAtom,
  targetCollectionFilterValueAtom,
} from "utils/dbSidebar";

export type SetQueryValues = {
  [key in keyof QueryValues]: (value: QueryValues[key]) => void;
};

export const useSetQueryValues = () => {
  const { query } = useRouter();
  const sourceLanguage = query.language as DbLang;

  const setScoreFilterValue = useSetAtom(scoreFilterValueAtom);
  const setParLengthFilterValue = useSetAtom(parLengthFilterValueAtom);
  const setFolioOptionValue = useSetAtom(folioOptionValueAtom);
  const setSortMethodOptionValue = useSetAtom(sortMethodOptionValueAtom);
  const setLimitCollectionFilterValue = useSetAtom(
    limitCollectionFilterValueAtom
  );
  const setTargetCollectionFilterValue = useSetAtom(
    targetCollectionFilterValueAtom
  );

  const setAllQueryValues = useCallback(
    (type: "initialize" | "reset") => {
      const limitCollectionValue =
        type === "initialize"
          ? DEFAULT_QUERY_VALUES.limit_collection
          : {
              // value explicitly set to avoid need for deep clone
              excludedCategories: new Map<string, CategoryMenuItem>(),
              excludedTexts: new Map<string, TextMenuItem>(),
              includedCategories: new Map<string, CategoryMenuItem>(),
              includedTexts: new Map<string, TextMenuItem>(),
            };

      setScoreFilterValue(DEFAULT_QUERY_VALUES.score);
      setParLengthFilterValue(DEFAULT_PAR_LENGTH_VALUES[sourceLanguage]);
      setFolioOptionValue(DEFAULT_QUERY_VALUES.folio);
      setSortMethodOptionValue(DEFAULT_QUERY_VALUES.sort_method);
      setLimitCollectionFilterValue(limitCollectionValue);
      setTargetCollectionFilterValue(DEFAULT_QUERY_VALUES.target_collection);
    },
    [
      setScoreFilterValue,
      setParLengthFilterValue,
      setFolioOptionValue,
      setSortMethodOptionValue,
      setLimitCollectionFilterValue,
      setTargetCollectionFilterValue,
      sourceLanguage,
    ]
  );

  const setQueryValues: SetQueryValues = {
    score: setScoreFilterValue,
    par_length: setParLengthFilterValue,
    folio: setFolioOptionValue,
    sort_method: setSortMethodOptionValue,
    limit_collection: setLimitCollectionFilterValue,
    target_collection: setTargetCollectionFilterValue,
  };

  return { setQueryValues, setAllQueryValues };
};
