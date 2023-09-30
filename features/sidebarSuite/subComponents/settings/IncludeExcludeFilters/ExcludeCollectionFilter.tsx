import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbMenus } from "@components/hooks/useDbMenus";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import type { CategoryMenuItem } from "types/api/menus";
import { ArrayParam, useQueryParam } from "use-query-params";

import { ListboxComponent, StyledPopper } from "./textMenuComponents";

const ExcludeCollectionFilter = () => {
  const { t } = useTranslation("settings");
  const { defaultParamConfig, uniqueSettings } = useDbQueryParams();

  const { categories, isLoadingCategories } = useDbMenus();

  const [excludeCollectionParam, setExcludeCollectionParam] = useQueryParam(
    uniqueSettings.queryParams.excludeCollection,
    ArrayParam
  );

  const [excludeCollectionValue, setExcludeCollectionValue] = useState<
    CategoryMenuItem[]
  >([]);

  useEffect(
    () =>
      setExcludeCollectionParam(
        excludeCollectionParam ?? defaultParamConfig.exclude_collection
      ),
    [excludeCollectionParam, setExcludeCollectionParam, defaultParamConfig]
  );

  const handleInputChange = (value: CategoryMenuItem[]) => {
    setExcludeCollectionValue(value);
    setExcludeCollectionParam(() => {
      return value.map((item) => `!${item.id}`);
    });
  };

  return (
    <Box sx={{ my: 1, width: 1 }}>
      <Autocomplete
        id="excluded-collections"
        sx={{ mt: 1, mb: 2 }}
        multiple={true}
        value={excludeCollectionValue ?? []}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={[...categories.values()]}
        getOptionLabel={(option) => option.name.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t(`filtersLabels.excludeCollections`)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoadingCategories ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => [props, option] as React.ReactNode}
        renderGroup={(params) => params as unknown as React.ReactNode}
        loading={isLoadingCategories}
        filterSelectedOptions
        disablePortal
        onChange={(event, value) => handleInputChange(value)}
      />
    </Box>
  );
};

export default ExcludeCollectionFilter;
