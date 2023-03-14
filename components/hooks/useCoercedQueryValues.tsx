// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TS disabled due to https://github.com/microsoft/TypeScript/issues/3500

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import {
  limitCollectionFilterValueAtom,
  type QueryParams,
  // targetCollectionFilterValueAtom,
} from "utils/dbSidebar";

import { useDbQueryParams } from "./useDbQueryParams";
import { type SetQueryValues, useSetQueryValues } from "./useSetQueryValues";
import { useTextLists } from "./useTextLists";

export const useCoercedQueryValues = () => {
  const { asPath, isReady } = useRouter();
  const { queryParams, setQueryParams, defaultQueryParams } =
    useDbQueryParams();
  const { texts, categories } = useTextLists();
  const { setQueryValues, setAllQueryValues } = useSetQueryValues();

  const urlHasParams = asPath.includes("?");

  const limitCollectionFilterValue = useAtomValue(
    limitCollectionFilterValueAtom
  );

  const setLimitCollectionValuesFromParams = (
    limitParams: QueryParams["limit_collection"]
  ) => {
    if (!limitParams) {
      return;
    }

    for (const limitation of limitParams) {
      const id = limitation.replace("!", "");
      const isExclusion = limitation.includes("!");

      const category = categories.get(id);
      const text = texts.get(id);

      if (isExclusion && category) {
        limitCollectionFilterValue.excludedCategories.set(id, category);
        continue;
      } else if (isExclusion && text) {
        limitCollectionFilterValue.excludedTexts.set(id, text);
        continue;
      } else if (category) {
        limitCollectionFilterValue.includedCategories.set(id, category);
        continue;
      } else if (text) {
        limitCollectionFilterValue.includedTexts.set(id, text);
      }
    }
  };

  useEffect(() => {
    if (urlHasParams) {
      for (const [key, paramValue] of Object.entries(queryParams)) {
        if (key === "limit_collection") {
          setLimitCollectionValuesFromParams(
            paramValue as QueryParams["limit_collection"]
          );
          continue;
        }
        if (key === "target_collection") {
          continue;
        }
        const setterKey = key as keyof SetQueryValues;
        setQueryValues[setterKey](paramValue);
      }
    } else {
      setAllQueryValues("initialize");
      setQueryParams(defaultQueryParams);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, texts, categories]);
};
