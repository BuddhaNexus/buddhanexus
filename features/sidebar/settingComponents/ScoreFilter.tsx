import { useTranslation } from "react-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { useAtom } from "jotai";
import { scoreFilterValueAtom } from "utils/dbUISettings";

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
  const { setDebouncedQueryParam } = useDbQueryParams();

  const { t } = useTranslation("settings");

  const [scroeValue, setQueryValue] = useAtom(scoreFilterValueAtom);

  const handleChange = (value: number) => {
    setQueryValue(value);
    setDebouncedQueryParam("score", normalizeValue(value));
  };

  const handleBlur = () => {
    if (scroeValue < 0) {
      setQueryValue(0);
    }

    if (scroeValue > 100) {
      setQueryValue(100);
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
        value={scroeValue}
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
          value={scroeValue}
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
