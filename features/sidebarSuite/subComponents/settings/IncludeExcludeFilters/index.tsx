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
  type LimitsParam,
} from "features/sidebarSuite/config/types";
import { omit } from "lodash";
import type { CategoryMenuItem, DatabaseText } from "types/api/menus";
import { JsonParam, useQueryParam } from "use-query-params";

import { ListboxComponent, StyledPopper } from "./uiComponents";

const IncludeExcludeFilters = () => {
  const { t } = useTranslation("settings");

  const { defaultParamConfig, uniqueSettings } = useDbQueryParams();

  const { texts, isLoadingTexts, categories, isLoadingCategories } =
    useDbMenus();

  const [limitsParam, setLimitsParam] = useQueryParam(
    uniqueSettings.queryParams.limits,
    JsonParam,
  );

  const [limitsValue, setLimitsValue] = useState<LimitsParam>({});

  useEffect(
    () => setLimitsParam(limitsParam ?? defaultParamConfig.limits),
    [limitsParam, setLimitsParam, defaultParamConfig],
  );

  const handleInputChange = (
    limit: Limit,
    value: (CategoryMenuItem | DatabaseText)[],
  ) => {
    const otherLimits = omit({ ...limitsValue }, limit) as LimitsParam;
    const otherLimitParams = Object.keys(otherLimits).reduce((params, key) => {
      return {
        ...params,
        [key]: otherLimits?.[key as Limit]!.map((limitItem) => limitItem.id),
      };
    }, {});
    const updatedLimitValues =
      value.length > 0 ? { ...otherLimits, [limit]: value } : otherLimits;
    setLimitsValue(updatedLimitValues);
    setLimitsParam(
      Object.keys(updatedLimitValues).length > 0
        ? {
            ...otherLimitParams,
            [limit]: value.map((limitItem) => limitItem.id),
          }
        : undefined,
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
