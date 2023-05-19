import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useTextLists } from "@components/hooks/useTextLists";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { DEFAULT_QUERY_PARAMS } from "features/sidebarSuite/common/dbSidebarSettings";
import {
  ListboxComponent,
  StyledPopper,
} from "features/sidebarSuite/common/textMenuComponents";
import { ArrayParam, useQueryParam } from "use-query-params";
import type { CategoryMenuItem } from "utils/api/textLists";

const ExcludeCollectionFilter = () => {
  const { t } = useTranslation("settings");

  const { categories, isLoadingCategories } = useTextLists();

  const [excludeCollectionParam, setExcludeCollectionParam] = useQueryParam(
    // TODO: replace with "exclude_collection",
    "limit_collection",
    ArrayParam
  );

  const [excludeCollectionValue, setExcludeCollectionValue] = useState<
    CategoryMenuItem[]
  >([]);

  useEffect(
    () =>
      setExcludeCollectionParam(
        excludeCollectionParam ?? DEFAULT_QUERY_PARAMS.exclude_collection
      ),
    [excludeCollectionParam, setExcludeCollectionParam]
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
