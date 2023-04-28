import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { debounce } from "lodash";
import { NumberParam, useQueryParam } from "use-query-params";
import { DEFAULT_QUERY_PARAMS } from "utils/dbUISettings";

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

  const [scoreParam, setScoreParam] = useQueryParam("score", NumberParam);
  const [scoreValue, setScoreValue] = useState(
    scoreParam ?? DEFAULT_QUERY_PARAMS.score
  );

  useEffect(() => {
    setScoreValue(scoreParam ?? DEFAULT_QUERY_PARAMS.score);
  }, [scoreParam]);

  const debouncedSetScoreParam = useMemo(
    () => debounce(setScoreParam, 600),
    [setScoreParam]
  );

  const handleChange = (value: number) => {
    const normalizedValue = normalizeValue(value);
    setScoreValue(normalizedValue);
    debouncedSetScoreParam(normalizedValue);
  };

  const handleBlur = () => {
    if (scoreValue < 0) {
      setScoreValue(0);
    }

    if (scoreValue > 100) {
      setScoreValue(100);
    }
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
