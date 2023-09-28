import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbMenus } from "@components/hooks/useDbMenus";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { ArrayParam, useQueryParam } from "use-query-params";
import type { TextMenuItem } from "utils/api/textLists";

import { ListboxComponent, StyledPopper } from "./textMenuComponents";

const IncludeTextFilter = () => {
  const { t } = useTranslation("settings");
  const { defaultParamConfig, settingsList } = useDbQueryParams();

  const { texts, isLoadingTexts } = useDbMenus();

  const [includeTextParam, setIncludeTextParam] = useQueryParam(
    settingsList.queryParams.includeText,
    ArrayParam
  );

  const [includeTextValue, setIncludeTextValue] = useState<TextMenuItem[]>([]);

  useEffect(
    () =>
      setIncludeTextParam(includeTextParam ?? defaultParamConfig.include_text),
    [includeTextParam, setIncludeTextParam, defaultParamConfig]
  );

  const handleInputChange = (value: TextMenuItem[]) => {
    setIncludeTextValue(value);
    setIncludeTextParam(() => {
      return value.map((item) => item.id);
    });
  };

  return (
    <Box sx={{ my: 1, width: 1 }}>
      <Autocomplete
        id="excluded-texts"
        sx={{ mt: 1, mb: 2 }}
        multiple={true}
        value={includeTextValue ?? []}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={[...texts.values()]}
        getOptionLabel={(option) => option.name.toUpperCase()}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t(`filtersLabels.includeTexts`)}
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

export default IncludeTextFilter;
