import * as React from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import type { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { SETTINGS_DRAWER_WIDTH } from "features/sidebarSuite/common/MuiStyledSidebarComponents";
import { ArrayParam, useQueryParam } from "use-query-params";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: SETTINGS_DRAWER_WIDTH - 60,
    },
  },
};

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
  const { t } = useTranslation("settings");
  const { fileName, uniqueSettings } = useDbQueryParams();
  const theme = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
    queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
  });

  const [selectedLanguages, setSelectedLanguages] = useQueryParam(
    uniqueSettings.remote.availableLanguages,
    ArrayParam
  );

  React.useEffect(() => {
    setSelectedLanguages(selectedLanguages ?? data);
  }, [setSelectedLanguages, data, selectedLanguages, isLoading]);

  const handleChange = (event: SelectChangeEvent<typeof selectedLanguages>) => {
    const {
      target: { value },
    } = event;

    setSelectedLanguages(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Box sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }}>
        <InputLabel id="demo-multiple-name-label">
          {t("optionsLabels.availableLanguages")}
        </InputLabel>
        {isLoading ? (
          <Select
            labelId="text-languages-label"
            id="text-languages"
            value={selectedLanguages ?? []}
            input={
              <OutlinedInput label={t("optionsLabels.availableLanguages")} />
            }
            MenuProps={MenuProps}
            multiple
            onChange={handleChange}
          >
            <MenuItem value="loading">
              <CircularProgress color="inherit" size={20} />
            </MenuItem>
          </Select>
        ) : (
          <Select
            labelId="text-languages-label"
            id="text-languages"
            value={selectedLanguages ?? []}
            input={
              <OutlinedInput label={t("optionsLabels.availableLanguages")} />
            }
            MenuProps={MenuProps}
            multiple
            onChange={handleChange}
          >
            {data?.map((lang: SourceLanguage) => {
              return (
                <MenuItem
                  key={lang}
                  value={lang}
                  style={getStyles(
                    lang,
                    selectedLanguages as SourceLanguage[],
                    theme
                  )}
                >
                  {t(`dbLanguageLabels.${lang}`)}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </FormControl>
    </Box>
  );
};

export default SourceLanguagesSelector;
