import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormLabel, Slider, TextField } from "@mui/material";
import { atom, useAtom } from "jotai";
import { QUERY_DEFAULTS } from "utils/dbUISettings";

function valueToString(value: number) {
  return `${value}`;
}

function normalizeValue(value: number | null | undefined) {
  // TODO set dynamic max
  if (!value || value < 0) {
    return QUERY_DEFAULTS.par_length;
  }

  if (value > 4000) {
    return 4000;
  }

  return value;
}

function getQueryParam(value: number | null | undefined) {
  return { par_length: normalizeValue(value) };
}

const queryValueAtom = atom<number>(normalizeValue(QUERY_DEFAULTS.par_length));

export default function MinMatchLengthFilter() {
  const { setQueryParams } = useDbQueryParams();

  const [queryValue, setQueryValue] = useAtom(queryValueAtom);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryValue(normalizeValue(Number(event.target.value)));
  };

  const handleSliderChange = (value: number) => {
    setQueryValue(value);

    setQueryParams(getQueryParam(queryValue));
  };

  const handleInputEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setQueryParams(getQueryParam(queryValue));
    }
  };

  const handleBlur = () => {
    setQueryParams(getQueryParam(queryValue));
  };

  // TODO: get dynamic mark values
  const marks = [
    {
      value: 30,
      label: "30",
    },
    {
      value: 4000,
      label: "4000",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <FormLabel id="min-match-input-label">
        Min. character/syllable match length:
      </FormLabel>
      <TextField
        sx={{ width: "100%", my: 1 }}
        value={queryValue}
        type="number"
        inputProps={{
          step: 50,
          min: 0,
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
          value={typeof queryValue === "number" ? queryValue : 30}
          aria-labelledby="min-match-input-label"
          getAriaValueText={valueToString}
          min={30}
          max={4000}
          marks={marks}
          onChange={(_, value) => setQueryValue(value as number)}
          onChangeCommitted={(_, value) => handleSliderChange(value as number)}
        />
      </Box>
    </Box>
  );
}
