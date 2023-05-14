import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useTextLists } from "@components/hooks/useTextLists";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { DEFAULT_QUERY_PARAMS } from "features/sidebar/common/dbSidebarSettings";
import {
  ListboxComponent,
  StyledPopper,
} from "features/sidebar/common/textMenuSubComponents";
import { ArrayParam, useQueryParam } from "use-query-params";
import type { CategoryMenuItem } from "utils/api/textLists";

const IncludeCollectionFilter = () => {
  const { t } = useTranslation("settings");

  const { categories, isLoadingCategories } = useTextLists();

  const [includeCollectionParam, setIncludeCollectionParam] = useQueryParam(
    // TODO: replace with "include_collection",
    "limit_collection",
    ArrayParam
  );

  const [includeCollectionValue, setIncludeCollectionValue] = useState<
    CategoryMenuItem[]
  >([]);

  useEffect(
    () =>
      setIncludeCollectionParam(
        includeCollectionParam ?? DEFAULT_QUERY_PARAMS.include_collection
      ),
    [includeCollectionParam, setIncludeCollectionParam]
  );

  const handleInputChange = (value: CategoryMenuItem[]) => {
    setIncludeCollectionValue(value);
    setIncludeCollectionParam(() => {
      return value.map((item) => item.id);
    });
  };

  return (
    <Box sx={{ my: 1, width: 1 }}>
      <Autocomplete
        id="excluded-collections"
        sx={{ mt: 1, mb: 2 }}
        multiple={true}
        value={includeCollectionValue ?? []}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={[...categories.values()]}
        getOptionLabel={(option) => option.name.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t(`filtersLabels.includeCollections`)}
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

export default IncludeCollectionFilter;
