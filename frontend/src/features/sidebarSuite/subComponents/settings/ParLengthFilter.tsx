import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { debounce } from "lodash";
import { NumberParam, useQueryParam } from "use-query-params";
import { uniqueSettings } from "@features/sidebarSuite/config/settings";

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

  const parLengthConfig = {
    default: 30,
    min: 10,
  };
  const [parLengthParam, setParLengthParam] = useQueryParam(
    uniqueSettings.queryParams.parLength,
    NumberParam
  );
  const [parLength, setParLength] = useState(
    parLengthParam ?? parLengthConfig.default
  );

  useEffect(() => {
    setParLength(parLengthParam ?? parLengthConfig.default);
  }, [parLengthParam, parLengthConfig.default]);

  const setDebouncedParLengthParam = useMemo(
    () => debounce(setParLengthParam, 600),
    [setParLengthParam]
  );

  const handleChange = useCallback(
    (value: number) => {
      const normalizedValue = normalizeValue(value, parLengthConfig.min);
      setParLength(value);
      setDebouncedParLengthParam(normalizedValue);
    },
    [parLengthConfig.min, setParLength, setDebouncedParLengthParam]
  );

  const marks = [
    {
      value: parLengthConfig.min,
      label: `${parLengthConfig.min}`,
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
      {/* TODO: define acceptance criteria for input change handling */}
      <TextField
        sx={{ width: 1, my: 1 }}
        value={parLength ?? ""}
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
          value={parLength ?? parLengthConfig.default}
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
