import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { useAtom } from "jotai";
import _debounce from "lodash/debounce";
import type { DbLang } from "utils/dbSidebar";
import {
  MIN_PAR_LENGTH_VALUES as MIN_VALUES,
  querySettingsValuesAtom,
} from "utils/dbSidebar";

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

export default function MinMatchLengthFilter() {
  const {
    queryParams,
    setQueryParams,
    sourceLanguage: lang,
  } = useDbQueryParams();

  const [queryValues, setQueryValues] = useAtom(querySettingsValuesAtom);

  const { t } = useTranslation("settings");

  const debouncedQuery = useMemo(
    () =>
      _debounce((value: number) => {
        setQueryParams({
          ...queryParams,
          par_length: normalizeValue(value, lang),
        });
      }, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setQueryParams, lang]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryValues({
      ...queryValues,
      par_length: {
        ...queryValues.par_length,
        [lang]: normalizeValue(Number(event.target.value), lang),
      },
    });
    debouncedQuery(Number(event.target.value));
  };

  const handleSliderChange = (value: number) => {
    setQueryValues({
      ...queryValues,
      par_length: {
        ...queryValues.par_length,
        [lang]: normalizeValue(value, lang),
      },
    });
    debouncedQuery(Number(value));
  };

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      par_length: queryValues.par_length[lang],
    });

    return () => {
      debouncedQuery.cancel();
    };
  }, [debouncedQuery, queryParams]);

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
    <Box sx={{ width: "100%" }}>
      <FormLabel id="min-match-input-label">
        {t("filtersLabels.minMatch")}
      </FormLabel>
      <TextField
        sx={{ width: "100%", my: 1 }}
        value={queryValues.par_length[lang]}
        type="number"
        inputProps={{
          step: 50,
          min: MIN_VALUES[lang],
          max: 4000,
          type: "number",
          "aria-labelledby": "min-match-input-label",
        }}
        onChange={handleInputChange}
      />
      <Box sx={{ ml: 1, width: "96%" }}>
        <Slider
          value={queryValues.par_length[lang]}
          aria-labelledby="min-match-input-label"
          getAriaValueText={valueToString}
          min={MIN_VALUES[lang]}
          max={4000}
          marks={marks}
          onChange={(_, value) => handleSliderChange(Number(value))}
        />
      </Box>
    </Box>
  );
}
