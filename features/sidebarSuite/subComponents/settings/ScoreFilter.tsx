import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { debounce } from "lodash";
import { NumberParam, useQueryParam } from "use-query-params";

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
  const { defaultParamConfig, uniqueSettings } = useDbQueryParams();

  const [scoreParam, setScoreParam] = useQueryParam(
    uniqueSettings.queryParams.score,
    NumberParam,
  );
  const [scoreValue, setScoreValue] = useState(
    scoreParam ?? defaultParamConfig.score,
  );

  useEffect(() => {
    setScoreValue(scoreParam ?? defaultParamConfig.score);
  }, [defaultParamConfig, scoreParam]);

  const setDebouncedScoreParam = useMemo(
    () => debounce(setScoreParam, 600),
    [setScoreParam],
  );

  const handleChange = useCallback(
    (value: number) => {
      const normalizedValue = normalizeValue(value);
      setScoreValue(value);
      setDebouncedScoreParam(normalizedValue);
    },
    [setScoreValue, setDebouncedScoreParam],
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
    <Box sx={{ width: 1, mb: 2 }}>
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
