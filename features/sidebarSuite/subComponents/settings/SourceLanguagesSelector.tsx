import * as React from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import type { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { ArrayParam, useQueryParam } from "use-query-params";
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
  const { defaultQueryParams, uniqueSettings } = useDbQueryParams();
  const theme = useTheme();

  const [selectedLanguages, setSelectedLanguages] = useQueryParam(
    uniqueSettings.remote.availableLanguages,
    ArrayParam
  );

  React.useEffect(() => {
    if (defaultQueryParams.multi_lingual) {
      setSelectedLanguages(defaultQueryParams.multi_lingual);
    }
  }, [defaultQueryParams.multi_lingual, setSelectedLanguages]);

  const handleChange = (event: SelectChangeEvent<typeof selectedLanguages>) => {
    const {
      target: { value },
    } = event;

    setSelectedLanguages(typeof value === "string" ? value.split(",") : value);
  };

  const selectorLabel = t("optionsLabels.availableLanguages");

  return (
    <Box sx={{ width: 1, my: 2 }}>
      <FormControl sx={{ width: 1 }}>
        <InputLabel id="text-languages-selector-label" shrink>
          {selectorLabel}
        </InputLabel>
        {defaultQueryParams.multi_lingual ? (
          <Select
            labelId="text-languages-selector-label"
            id="text-languages"
            label={selectorLabel}
            value={selectedLanguages ?? []}
            input={<OutlinedInput label={selectorLabel} notched />}
            renderValue={(selected) =>
              selected.length > 0 ? (
                selected
                  .map((selection) =>
                    t(`language.${selection as unknown as SourceLanguage}`, {
                      ns: "common",
                    })
                  )
                  .join(", ")
              ) : (
                <em style={{ color: theme.palette.text.secondary }}>
                  {t("prompts.noSelection", {
                    ns: "common",
                  })}
                </em>
              )
            }
            multiple
            displayEmpty
            onChange={handleChange}
          >
            {defaultQueryParams.multi_lingual?.map(
              (langKey: SourceLanguage) => (
                <MenuItem
                  key={langKey}
                  value={langKey}
                  style={getStyles(
                    langKey,
                    selectedLanguages as SourceLanguage[],
                    theme
                  )}
                >
                  <Checkbox
                    checked={
                      selectedLanguages
                        ? selectedLanguages.includes(langKey)
                        : false
                    }
                  />
                  <ListItemText
                    primary={t(`language.${langKey}`, { ns: "common" })}
                  />
                </MenuItem>
              )
            )}
          </Select>
        ) : (
          <Select
            labelId="text-languages-selector-label"
            id="text-languages"
            value="loading"
            input={<OutlinedInput label={selectorLabel} />}
            disabled
          >
            <MenuItem value="loading">
              <CircularProgress color="inherit" size={18} />
            </MenuItem>
          </Select>
        )}
      </FormControl>
    </Box>
  );
};

export default SourceLanguagesSelector;
