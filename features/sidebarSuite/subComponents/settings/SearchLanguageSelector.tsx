import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { StringParam, useQueryParam } from "use-query-params";
import { SourceLanguage as SourceLanguageEnum } from "utils/constants";

const SearchLanguageSelector = () => {
  const { t } = useTranslation("settings");
  const { settingEnums } = useDbQueryParams();

  const [currentLang, setCurrentDbLang] = useQueryParam(
    settingEnums.SearchPageFilterEnum.LANGUAGE,
    StringParam
  );

  return (
    <FormControl variant="filled" sx={{ width: 1, mb: 2 }}>
      <InputLabel id="db-language-selector-label" sx={{ mb: 1 }}>
        {t(`dbLanguageLabels.instructions`)}
      </InputLabel>
      <Select
        labelId="db-language-selector-label"
        id="db-language-selector"
        value={currentLang ?? "all"}
        onChange={(e) =>
          setCurrentDbLang(
            e.target.value === "all" ? undefined : e.target.value
          )
        }
      >
        <MenuItem key="all" value="all">
          {t(`dbLanguageLabels.all`)}
        </MenuItem>
        {Object.values(SourceLanguageEnum).map((option) => (
          <MenuItem key={option} value={option}>
            {t(`dbLanguageLabels.${option}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SearchLanguageSelector;
