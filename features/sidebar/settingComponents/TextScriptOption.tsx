import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import type { DbLang } from "utils/dbSidebar";

type Script = "unicode" | "wylie";

const SCRIPT_OPTIONS: Partial<Record<DbLang, Script[]>> = {
  tib: ["wylie", "unicode"],
};

export default function TextScriptOption() {
  const [value, setValue] = React.useState("wylie");
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");

  const handleSelectChange = (value: string) => {
    //  TODO: handle script change
    setValue(value);
  };

  if (!SCRIPT_OPTIONS[sourceLanguage]) {
    return null;
  }

  return (
    <FormControl sx={{ width: "100%" }}>
      <FormLabel id="tibetan-script-selection-label">
        {t("optionsLabels.script")}
      </FormLabel>

      <Select
        id="sort-option-selector"
        aria-labelledby="sort-option-selector-label"
        defaultValue="position"
        value={value}
        onChange={(e) => handleSelectChange(e.target.value)}
      >
        {SCRIPT_OPTIONS[sourceLanguage]?.map((script) => {
          return (
            <MenuItem key={script} value={script}>
              {t(`optionsLabels.${script}`)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
