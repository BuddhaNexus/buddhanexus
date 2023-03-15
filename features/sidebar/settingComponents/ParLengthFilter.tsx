import { useTranslation } from "react-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { useAtom } from "jotai";
import type { DbLang } from "utils/dbSidebar";
import {
  DEFAULT_PAR_LENGTH_VALUES as DEFAUT_VALUES,
  MIN_PAR_LENGTH_VALUES as MIN_VALUES,
  parLengthFilterValueAtom,
} from "utils/dbSidebar";

function valueToString(value: number) {
  return `${value}`;
}

function normalizeValue(value: number | null | undefined, lang: DbLang) {
  // TODO set dynamic max
  if (!value || value < MIN_VALUES[lang]) {
    return MIN_VALUES[lang];
  }

  if (value > 4000) {
    return 4000;
  }

  return value;
}

export default function ParLengthFilter() {
  const { sourceLanguage: lang, setDebouncedQueryParam } = useDbQueryParams();

  const { t } = useTranslation("settings");

  const [parLength, setParLenth] = useAtom(parLengthFilterValueAtom);

  const handleChange = (value: number) => {
    setParLenth(value);
    setDebouncedQueryParam("par_length", normalizeValue(value, lang));
  };

  const handleBlur = () => {
    if (!parLength || parLength < MIN_VALUES[lang]) {
      setParLenth(MIN_VALUES[lang]);
    }

    if (parLength && parLength > 4000) {
      setParLenth(4000);
    }
  };

  // TODO: get dynamic mark values
  const marks = [
    {
      value: MIN_VALUES[lang],
      label: `${MIN_VALUES[lang]}`,
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
        value={parLength ?? DEFAUT_VALUES[lang]}
        type="number"
        inputProps={{
          step: 50,
          min: MIN_VALUES[lang],
          max: 4000,
          type: "number",
          "aria-labelledby": "min-match-input-label",
        }}
        onBlur={handleBlur}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <Box sx={{ ml: 1, width: "96%" }}>
        <Slider
          value={parLength ?? DEFAUT_VALUES[lang]}
          aria-labelledby="min-match-input-label"
          getAriaValueText={valueToString}
          min={MIN_VALUES[lang]}
          max={4000}
          marks={marks}
          onChange={(_, value) => handleChange(Number(value))}
        />
      </Box>
    </Box>
  );
}
