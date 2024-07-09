import * as React from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { scriptSelectionAtom } from "features/atoms";
import { useAtom } from "jotai";
import type { SourceLanguage } from "utils/constants";

export type Script = "Unicode" | "Wylie";

const SCRIPT_OPTIONS: Partial<Record<SourceLanguage, Script[]>> = {
  tib: ["Unicode", "Wylie"],
};
const DEFAULT_SCRIPT = "Unicode";

export default function TextScriptOption() {
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");

  const [scriptSelection, setScriptSelection] = useAtom(scriptSelectionAtom);

  React.useEffect(() => {
    const storedSelection = window.localStorage.getItem(
      "text-script-selection",
    );

    if (storedSelection && storedSelection !== "undefined") {
      setScriptSelection(JSON.parse(storedSelection));
    }
  }, [setScriptSelection]);

  React.useEffect(() => {
    window.localStorage.setItem(
      "text-script-selection",
      JSON.stringify(scriptSelection),
    );
  }, [scriptSelection]);

  return (
    <FormControl sx={{ width: 1, mb: 1 }}>
      <InputLabel id="text-script-selection-label">
        {t("optionsLabels.script")}
      </InputLabel>

      <Select
        labelId="text-script-selection-label"
        aria-labelledby="sort-option-selector-label"
        defaultValue="position"
        inputProps={{
          id: "sort-option-selector",
        }}
        input={<OutlinedInput label={t("optionsLabels.script")} />}
        value={scriptSelection ?? DEFAULT_SCRIPT}
        onChange={(e) => setScriptSelection(e.target.value as Script)}
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
