import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbMenus } from "@components/hooks/useDbMenus";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormLabel,
  TextField,
} from "@mui/material";
import {
  type Limit,
  limits,
  type LimitsFilterValue,
  type LimitsParam,
} from "features/sidebarSuite/config/types";
import { JsonParam, useQueryParam } from "use-query-params";
import type { ParsedCategoryMenuItem } from "utils/api/endpoints/menus/category";
import type { ParsedTextFileMenuItem } from "utils/api/endpoints/menus/files";

import ListboxComponent from "./ListboxComponent";
import { StyledPopper } from "./muiStyledComponents";

type LimitValueOption = (
  | ParsedCategoryMenuItem
  | Pick<ParsedTextFileMenuItem, "id" | "name" | "label">
)[];

function getValuesFromParams(
  params: LimitsParam,
  texts: Map<string, ParsedTextFileMenuItem>,
  categories: Map<string, ParsedCategoryMenuItem>,
) {
  return Object.entries(params).reduce((values, [filter, selections]) => {
    const list = filter.startsWith("category") ? categories : texts;

    const filterItems = selections.map((id) => list.get(id));

    return { ...values, [filter]: filterItems };
  }, {});
}

function getParamsFromValues(
  updatedLimit: Limit,
  updatedvalue: LimitValueOption,
  params: LimitsParam,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [updatedLimit]: prevValue, ...otherLimitParams } = params;

  const updatedParam = updatedvalue.map((item) => item.id);
  return {
    ...otherLimitParams,
    ...(updatedParam.length > 0 && {
      [updatedLimit]: updatedParam,
    }),
  };
}

const IncludeExcludeFilters = ({ language }: { language: string }) => {
  const { t } = useTranslation("settings");

  const { defaultParamConfig, uniqueSettings } = useDbQueryParams();

  const { texts, isLoadingTexts, categories, isLoadingCategories } =
    useDbMenus();

  const [limitsParam, setLimitsParam] = useQueryParam(
    uniqueSettings.queryParams.limits,
    JsonParam,
  );

  const [limitsValue, setLimitsValue] = useState<LimitsFilterValue>({});
  const isInitilized = React.useRef(false);
  const isValueSet = React.useRef(false);

  const updateLimitsValue = React.useCallback(() => {
    if (!isInitilized.current && !isLoadingTexts && !isLoadingCategories) {
      const values = getValuesFromParams(limitsParam ?? {}, texts, categories);
      setLimitsValue(values);
      isInitilized.current = true;
    }
  }, [
    isLoadingTexts,
    isLoadingCategories,
    texts,
    categories,
    limitsParam,
    setLimitsValue,
  ]);

  const handleGlobalParamReset = React.useCallback(() => {
    // `isValueSet` deals with param-value setting cycle
    // and avoids selection flicker & update lag
    isValueSet.current = false;
    setLimitsValue({});
  }, [isValueSet, setLimitsValue]);

  useEffect(() => {
    if (!language) return;

    if (!isValueSet.current && limitsParam) {
      isValueSet.current = true;
      return;
    }

    if (isValueSet.current && !limitsParam) {
      handleGlobalParamReset();
      return;
    }

    updateLimitsValue();
  }, [
    language,
    updateLimitsValue,
    limitsParam,
    isValueSet,
    handleGlobalParamReset,
  ]);

  const handleInputChange = (limit: Limit, value: LimitValueOption) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [limit]: prevValue, ...otherLimitValues } = limitsValue;

    const updatedLimitValues =
      value.length > 0
        ? { ...otherLimitValues, [limit]: value }
        : otherLimitValues;
    setLimitsValue(updatedLimitValues);

    const updatedParams = getParamsFromValues(limit, value, limitsParam ?? {});
    setLimitsParam(
      Object.keys(updatedParams).length > 0
        ? updatedParams
        : defaultParamConfig.limits,
    );
  };

  const limitFilters = React.useMemo(() => {
    return limits.map((limit) => {
      const filter = limit.startsWith("file")
        ? { options: [...texts.values()], isLoading: isLoadingTexts }
        : {
            options: [...categories.values()].map((category) => ({
              // gets common properties defined in `LimitValueOption`
              // to ensure type alaignment
              id: category.id,
              name: category.name,
              label: category.label,
            })),
            isLoading: isLoadingCategories,
          };

      return {
        filertName: limit,
        filter,
      };
    });
  }, [categories, texts, isLoadingTexts, isLoadingCategories]);

  if (!language) return null;

  return (
    <>
      <FormLabel id="exclude-include-filters-label">
        {t("filtersLabels.includeExcludeFilters")}
      </FormLabel>
      {limitFilters.map((limit) => {
        const {
          filertName,
          filter: { options, isLoading },
        } = limit;

        const filterValue = limitsValue[filertName];

        return (
          <Box key={`limit-filter-${filertName}`} sx={{ my: 1, width: 1 }}>
            <Autocomplete
              id={filertName}
              sx={{ mt: 1, mb: 2 }}
              multiple={true}
              value={filterValue ?? []}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              PopperComponent={StyledPopper}
              // sets the rendered option label
              ListboxComponent={ListboxComponent}
              options={options}
              getOptionLabel={(option) =>
                `${option.id.toUpperCase()} ${option.name}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t([`filtersLabels.${filertName}`])}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) =>
                [props, option] as React.ReactNode
              }
              renderGroup={(params) => params as unknown as React.ReactNode}
              loading={isLoading}
              filterSelectedOptions
              disablePortal
              onChange={(event, value) => handleInputChange(filertName, value)}
            />
          </Box>
        );
      })}
    </>
  );
};

export default IncludeExcludeFilters;
