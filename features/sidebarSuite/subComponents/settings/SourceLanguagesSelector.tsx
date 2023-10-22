import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSearchParams } from "@components/hooks/useTypedSearchParams";
import {
  Box,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import type { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";
// import { ArrayParam, useQueryParam } from "use-query-params";
import type { SourceLanguage } from "utils/constants";

function getStyles(
  name: SourceLanguage,
  selectedLanguages: SourceLanguage[] | undefined,
  theme: Theme
) {
  if (!selectedLanguages) return;
  return {
    fontWeight: selectedLanguages.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const SourceLanguagesSelector = () => {
  const { t } = useTranslation(["settings", "common"]);
  const router = useRouter();
  const { fileName, defaultQueryParams, queryParams, uniqueSettings } =
    useDbQueryParams();
  const theme = useTheme();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { data: availableLanguages } = useQuery({
    queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
    queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
  });

  const isDefault = React.useRef(true);

  const [paramValue, setParamValue] = React.useState([
    ...(availableLanguages ?? []),
  ]);

  React.useEffect(() => {
    // A string type indicates the user has made a de/selection (even if the selection is empty).
    if (isDefault.current && typeof queryParams.multi_lingual === "string") {
      isDefault.current = false;
    }
    if (!isDefault.current && queryParams.multi_lingual === undefined) {
      isDefault.current = true;
      setParamValue([...(availableLanguages ?? [])]);
    }
  }, [defaultQueryParams.multi_lingual, queryParams.multi_lingual]);

  const handleChange = async (event: any) => {
    const {
      target: { value },
    } = event;

    setParamValue(value);
    params.set(uniqueSettings.remote.availableLanguages, value.join(","));

    await router.push({
      pathname: router.pathname,
      query: params.toString(),
    });
  };

  const selectorLabel = t("optionsLabels.availableLanguages");

  return (
    <Box sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }}>
        <InputLabel id="text-languages-selector-label" shrink>
          {selectorLabel}
        </InputLabel>
        <Select
          labelId="text-languages-selector-label"
          id="text-languages"
          label={selectorLabel}
          value={paramValue}
          input={<OutlinedInput label={selectorLabel} notched />}
          renderValue={(selected) =>
            selected.length > 0 ? (
              selected
                .map((selection) =>
                  t(`common:language.${selection as unknown as SourceLanguage}`)
                )
                .join(", ")
            ) : (
              <em style={{ color: theme.palette.text.secondary }}>
                {t("generic.noSelection")}
              </em>
            )
          }
          multiple
          displayEmpty
          onChange={handleChange}
        >
          {availableLanguages?.map((langKey: SourceLanguage) => (
            <MenuItem
              key={langKey}
              value={langKey}
              style={getStyles(langKey, availableLanguages, theme)}
            >
              <Checkbox checked={paramValue?.includes(langKey)} />
              <ListItemText primary={t(`common:language.${langKey}`)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SourceLanguagesSelector;
