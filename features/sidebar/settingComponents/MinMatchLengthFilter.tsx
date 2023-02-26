import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import type { DbLang } from "utils/dbSidebar";
import { QUERY_DEFAULTS } from "utils/dbSidebar";

const MIN_VALUES = { tib: 7, chn: 5, pli: 25, skt: 25 };

function valueToString(value: number) {
  return `${value}`;
}

function normalizeValue(value: number | null | undefined, lang: DbLang) {
  // TODO set dynamic max
  if (!value || value < 0) {
    return MIN_VALUES[lang];
  }

  if (value > 4000) {
    return 4000;
  }

  return value;
}

function getQueryParam(value: number | null | undefined, lang: DbLang) {
  return { par_length: normalizeValue(value, lang) };
}

export default function MinMatchLengthFilter() {
  const { setQueryParams, sourceLanguage } = useDbQueryParams();

  const [queryValue, setQueryValue] = useState<number>(
    QUERY_DEFAULTS.par_length[sourceLanguage]
  );
  const { t } = useTranslation("settings");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryValue(normalizeValue(Number(event.target.value), sourceLanguage));
  };

  const handleSliderChange = (value: number) => {
    setQueryValue(value);

    setQueryParams(getQueryParam(queryValue, sourceLanguage));
  };

  const handleInputEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setQueryParams(getQueryParam(queryValue, sourceLanguage));
    }
  };

  const handleBlur = () => {
    setQueryParams(getQueryParam(queryValue, sourceLanguage));
  };

  // TODO: get dynamic mark values
  const marks = [
    {
      value: MIN_VALUES[sourceLanguage],
      label: `${MIN_VALUES[sourceLanguage]}`,
    },
    // TODO set dynamic max
    {
      value: 4000,
      label: "4000",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <FormLabel id="min-match-input-label">
        {t("filtersLabels.minMatch")}
      </FormLabel>
      <TextField
        sx={{ width: "100%", my: 1 }}
        value={queryValue}
        type="number"
        inputProps={{
          step: 50,
          min: MIN_VALUES[sourceLanguage],
          max: 4000,
          type: "number",
          "aria-labelledby": "min-match-input-label",
        }}
        onKeyUp={handleInputEnter}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
      <Box sx={{ ml: 1, width: "96%" }}>
        <Slider
          value={
            typeof queryValue === "number"
              ? queryValue
              : QUERY_DEFAULTS.par_length[sourceLanguage]
          }
          aria-labelledby="min-match-input-label"
          getAriaValueText={valueToString}
          min={MIN_VALUES[sourceLanguage]}
          max={4000}
          marks={marks}
          onChange={(_, value) => setQueryValue(Number(value))}
          onChangeCommitted={(_, value) => handleSliderChange(Number(value))}
        />
      </Box>
    </Box>
  );
}
