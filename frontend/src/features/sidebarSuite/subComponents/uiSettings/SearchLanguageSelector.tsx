import { useTranslation } from "next-i18next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { dbLanguages } from "@utils/api/constants";

import { getValidDbLanguage } from "@utils/validators";

import { useLanguageParam } from "@components/hooks/params";
import React from "react";

const SearchLanguageSelector = () => {
  const { t } = useTranslation(["common", "settings"]);

  const [language, setLanguage] = useLanguageParam();

  const handleChange = React.useCallback(
    (event: SelectChangeEvent) => {
      const value = event.target.value;
      setLanguage(value === "all" ? null : getValidDbLanguage(value));
    },
    [setLanguage]
  );

  return (
    <FormControl variant="filled" sx={{ width: 1, mb: 2 }}>
      <InputLabel id="db-language-selector-label" sx={{ mb: 1 }}>
        {t(`settings:generic.selectLanguage`)}
      </InputLabel>
      <Select
        labelId="db-language-selector-label"
        aria-labelledby="db-language-selector-label"
        id="db-language-selector"
        value={language ?? "all"}
        onChange={handleChange}
      >
        <MenuItem key="all" value="all">
          {t(`language.all`)}
        </MenuItem>
        {dbLanguages.map((option) => (
          <MenuItem key={option} value={option}>
            {t(`language.${option}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SearchLanguageSelector;
