import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useTextLists } from "@components/hooks/useTextLists";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { DEFAULT_QUERY_PARAMS } from "features/sidebarSuite/common/dbSidebarSettings";
import { ArrayParam, useQueryParam } from "use-query-params";
import type { TextMenuItem } from "utils/api/textLists";

import { ListboxComponent, StyledPopper } from "./textMenuComponents";

const IncludeTextFilter = () => {
  const { t } = useTranslation("settings");

  const { texts, isLoadingTexts } = useTextLists();

  const [includeTextParam, setIncludeTextParam] = useQueryParam(
    // TODO: replace with "include_text",
    "limit_collection",
    ArrayParam
  );

  const [includeTextValue, setIncludeTextValue] = useState<TextMenuItem[]>([]);

  useEffect(
    () =>
      setIncludeTextParam(
        includeTextParam ?? DEFAULT_QUERY_PARAMS.include_text
      ),
    [includeTextParam, setIncludeTextParam]
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
