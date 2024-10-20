import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useParLengthParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { MIN_PAR_LENGTH_VALUES } from "@features/sidebarSuite/uiSettingsDefinition";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { debounce } from "lodash";

function valueToString(value: number) {
  return `${value}`;
}

function normalizeValue(value: number, min: number) {
  if (!value || value < min) {
    return min;
  }

  // TODO set dynamic max
  if (value > 4000) {
    return 4000;
  }

  return value;
}

export default function ParLengthFilter() {
  const { t } = useTranslation("settings");

  const { dbLanguage } = useDbRouterParams();

  const [parLengthParam, setParLengthParam] = useParLengthParam();
  const [parLengthValue, setparLengthValue] = useState(parLengthParam);

  const minValue = MIN_PAR_LENGTH_VALUES[dbLanguage];

  useEffect(() => {
    setparLengthValue(parLengthParam);
  }, [parLengthParam]);

  const setDebouncedParLengthParam = useMemo(
    () => debounce(setParLengthParam, 600),
    [setParLengthParam],
  );

  const handleChange = useCallback(
    async (value: number) => {
      const normalizedValue = normalizeValue(value, minValue);
      setparLengthValue(value);
      await setDebouncedParLengthParam(normalizedValue);
    },
    [minValue, setparLengthValue, setDebouncedParLengthParam],
  );

  const marks = [
    {
      value: minValue,
      label: `${minValue}`,
    },
    // TODO set dynamic max
    {
      value: 4000,
      label: "4000",
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <FormLabel id="min-match-input-label">
        {t("filtersLabels.minMatch")}
      </FormLabel>

      <TextField
        sx={{ width: 1, my: 1 }}
        value={parLengthValue}
        type="number"
        inputProps={{
          min: 0,
          max: 4000,
          type: "number",
          "aria-labelledby": "min-match-input-label",
        }}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <Box sx={{ ml: 1, width: "96%" }}>
        <Slider
          value={parLengthValue}
          aria-labelledby="min-match-input-label"
          getAriaValueText={valueToString}
          min={0}
          max={4000}
          marks={marks}
          onChange={(_, value) => handleChange(Number(value))}
        />
      </Box>
    </Box>
  );
}
