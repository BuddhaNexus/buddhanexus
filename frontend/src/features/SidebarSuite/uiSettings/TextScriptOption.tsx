import * as React from "react";
import { useTranslation } from "next-i18next";
import { scriptSelectionAtom } from "@atoms";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import type { Script } from "@features/SidebarSuite/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { DbLanguage } from "@utils/api/types";
import { useAtom } from "jotai";

const SCRIPT_OPTIONS: Partial<Record<DbLanguage, Script[]>> = {
  bo: ["Unicode", "Wylie"],
};

export default function TextScriptOption() {
  const { dbLanguage } = useDbPageRouterParams();
  const { t } = useTranslation("settings");

  const [scriptSelection, setScriptSelection] = useAtom(scriptSelectionAtom);

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
        value={scriptSelection}
        onChange={(e) => setScriptSelection(e.target.value as Script)}
      >
        {SCRIPT_OPTIONS[dbLanguage]?.map((script) => {
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
