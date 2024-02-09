import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import type { CategoryMenuItem, DatabaseText } from "types/api/menus";
import { JsonParam, useQueryParam } from "use-query-params";

import ListboxComponent from "./ListboxComponent";
import { StyledPopper } from "./muiStyledComponents";

function getValuesFromParams(
  params: LimitsParam,
  texts: Map<string, DatabaseText>,
  categories: Map<string, CategoryMenuItem>,
) {
  return Object.entries(params).reduce((values, [filter, selections]) => {
    const list = filter.startsWith("category") ? categories : texts;

    const filterItems = selections.map((id) => list.get(id));

    return { ...values, [filter]: filterItems };
  }, {});
}
function getParamsFromValues(
  updatedLimit: Limit,
  updatedvalue: (CategoryMenuItem | DatabaseText)[],
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

const IncludeExcludeFilters = ({ lanuguage }: { lanuguage: string }) => {
  const { t } = useTranslation("settings");

  const { defaultParamConfig, uniqueSettings } = useDbQueryParams();

  const { texts, isLoadingTexts, categories, isLoadingCategories } =
    useDbMenus();

  const [limitsParam, setLimitsParam] = useQueryParam(
    uniqueSettings.queryParams.limits,
    JsonParam,
  );
  const [limitsValue, setLimitsValue] = useState<LimitsFilterValue>({});

  useEffect(() => {
    if (lanuguage) {
      const values = getValuesFromParams(limitsParam ?? {}, texts, categories);
      setLimitsValue(values);
    } else {
      setLimitsParam(defaultParamConfig.limits);
      setLimitsValue({});
    }
  }, [
    texts,
    categories,
    limitsParam,
    setLimitsParam,
    lanuguage,
    defaultParamConfig,
  ]);

  if (!lanuguage) return null;

  const handleInputChange = (
    limit: Limit,
    value: (CategoryMenuItem | DatabaseText)[],
  ) => {
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

  return (
    <>
      <FormLabel id="exclude-include-filters-label">
        {t("filtersLabels.includeExcludeFilters")}
      </FormLabel>
      {limits.map((limit) => {
        const filterValue = limitsValue[limit];
        const filter = limit.startsWith("file")
          ? { options: [...texts.values()], isLoading: isLoadingTexts }
          : {
              options: [...categories.values()],
              isLoading: isLoadingCategories,
            };

        const { options, isLoading } = filter;

        return (
          <Box key={limit} sx={{ my: 1, width: 1 }}>
            <Autocomplete
              id={limit}
              sx={{ mt: 1, mb: 2 }}
              multiple={true}
              value={filterValue ?? []}
              PopperComponent={StyledPopper}
              // sets the rendered option label
              ListboxComponent={ListboxComponent}
              options={options}
              getOptionLabel={(option) => option.name.toUpperCase()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t([`filtersLabels.${limit}`])}
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
              onChange={(event, value) => handleInputChange(limit, value)}
            />
          </Box>
        );
      })}
    </>
  );
};

export default IncludeExcludeFilters;
