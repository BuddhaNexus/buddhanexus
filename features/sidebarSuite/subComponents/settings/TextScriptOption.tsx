import * as React from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { StringParam, useQueryParam } from "use-query-params";
import type { SourceLanguage } from "utils/constants";

export type Script = "Unicode" | "Wylie";

const SCRIPT_OPTIONS: Partial<Record<SourceLanguage, Script[]>> = {
  tib: ["Unicode", "Wylie"],
};
const DEFALT_SCRIPT = "Unicode";

// TODO: add convertion to text-view on view completion
export default function TextScriptOption() {
  const { sourceLanguage, uniqueSettings } = useDbQueryParams();
  const { t } = useTranslation("settings");

  const [scriptSelection, setScriptSelection] = useQueryParam(
    uniqueSettings.local.script,
    StringParam
  );

  if (!SCRIPT_OPTIONS[sourceLanguage]) {
    return null;
  }

  return (
    <FormControl sx={{ width: 1 }}>
      <FormLabel id="tibetan-script-selection-label">
        {t("optionsLabels.script")}
      </FormLabel>

      <Select
        id="sort-option-selector"
        aria-labelledby="sort-option-selector-label"
        defaultValue="position"
        value={scriptSelection ?? DEFALT_SCRIPT}
        onChange={(e) => setScriptSelection(e.target.value)}
      >
        {SCRIPT_OPTIONS[sourceLanguage]?.map((script) => {
          return (
            <MenuItem key={script} value={script}>
              {script}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
