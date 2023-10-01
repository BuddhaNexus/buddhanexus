import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbMenus } from "@components/hooks/useDbMenus";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import type { DatabaseText } from "types/api/menus";
import { ArrayParam, useQueryParam } from "use-query-params";

import { ListboxComponent, StyledPopper } from "./textMenuComponents";

const ExcludeTextFilter = () => {
  const { t } = useTranslation("settings");
  const { defaultParamConfig, uniqueSettings } = useDbQueryParams();

  const { texts, isLoadingTexts } = useDbMenus();

  const [excludeTextParam, setExcludeTextParam] = useQueryParam(
    uniqueSettings.queryParams.excludeText,
    ArrayParam
  );

  const [excludeTextValue, setExcludeTextValue] = useState<DatabaseText[]>([]);

  useEffect(
    () =>
      setExcludeTextParam(excludeTextParam ?? defaultParamConfig.exclude_text),
    [excludeTextParam, setExcludeTextParam, defaultParamConfig]
  );

  const handleInputChange = (value: DatabaseText[]) => {
    setExcludeTextValue(value);
    setExcludeTextParam(() => {
      return value.map((item) => `!${item.id}`);
    });
  };

  return (
    <Box sx={{ my: 1, width: 1 }}>
      <Autocomplete
        id="excluded-texts"
        sx={{ mt: 1, mb: 2 }}
        multiple={true}
        value={excludeTextValue ?? []}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={[...texts.values()]}
        getOptionLabel={(option) => option.name.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t(`filtersLabels.excludeTexts`)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoadingTexts ? (
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
        loading={isLoadingTexts}
        filterSelectedOptions
        disablePortal
        onChange={(event, value) => handleInputChange(value)}
      />
    </Box>
  );
};

export default ExcludeTextFilter;
