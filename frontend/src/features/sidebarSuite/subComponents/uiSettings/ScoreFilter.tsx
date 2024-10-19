import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { debounce } from "lodash";
import { NumberParam, useQueryParam } from "use-query-params";
import {
  allUIComponentParamNames,
  DEFAULT_PARAM_VALUES,
} from "@features/sidebarSuite/uiSettingsDefinition";

import { useFilterParam } from "@components/hooks/params/filters";

function valueToString(value: number) {
  return `${value}`;
}

function normalizeValue(value: number | null | undefined) {
  if (!value || value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
}

export default function ScoreFilter() {
  const { t } = useTranslation("settings");

  const [filtersParam, setFiltersParam] = useFilterParam();
  const [scoreValue, setScoreValue] = useState(
    filtersParam?.score || DEFAULT_PARAM_VALUES.score
  );

  useEffect(() => {
    setScoreValue(filtersParam?.score ?? DEFAULT_PARAM_VALUES.score);
  }, [filtersParam?.score]);

  const setDebouncedScoreParam = useMemo(
    () => debounce(setFiltersParam, 600),
    [setFiltersParam]
  );

  const handleChange = useCallback(
    (value: number) => {
      const normalizedValue = normalizeValue(value);
      setScoreValue(value);
      setDebouncedScoreParam((prev) => {
        return {
          ...prev,
          score: normalizedValue,
        };
      });
    },
    [setScoreValue, setDebouncedScoreParam]
  );

  const handleBlur = () => {
    setScoreValue(normalizeValue(scoreValue));
  };

  const marks = [
    {
      value: 0,
      label: `${0}%`,
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <FormLabel id="score-input-label">{t("filtersLabels.score")}</FormLabel>
      <TextField
        sx={{ width: 1, my: 1 }}
        value={scoreValue}
        type="number"
        inputProps={{
          step: 1,
          min: 0,
          max: 100,
          type: "number",
          "aria-labelledby": "score-input-label",
        }}
        onBlur={handleBlur}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <Box sx={{ ml: 1, width: "96%" }}>
        <Slider
          value={scoreValue}
          aria-labelledby="score-input-label"
          getAriaValueText={valueToString}
          min={0}
          max={100}
          marks={marks}
          onChange={(_, value) => handleChange(Number(value))}
        />
      </Box>
    </Box>
  );
}
