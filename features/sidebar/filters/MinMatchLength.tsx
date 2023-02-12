import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useParallels } from "features/sidebar/context";

function valuetext(value: number) {
  return `${value}`;
}

export default function MinMatchLengthFilter({
  sourceLang,
  currentView,
}: {
  sourceLang: string;
  currentView: string;
}) {
  const { queryParams, setQueryParams } = useParallels();

  const [queryValue, setQueryValue] = useState<
    (number | string)[] | number | string
  >(Number(queryParams.par_length));

  useEffect(() => {
    setQueryValue(queryParams.par_length!);
  }, [queryParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleSliderChange = (value: number[] | number) => {
    setQueryValue(value);

    setQueryParams({ ...queryParams, par_length: queryValue.toString() });
  };

  const handleInputEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setQueryParams({ ...queryParams, par_length: queryValue.toString() });
    }
  };

  const handleBlur = () => {
    if (queryValue < 0) {
      setQueryValue(0);
    } else if (queryValue > 4000) {
      setQueryValue(4000);
    }

    setQueryParams({ ...queryParams, par_length: queryValue.toString() });
  };

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
    <Box sx={{ width: 272 }}>
      <Typography id="input-slider" gutterBottom>
        Min. character match length for {sourceLang} in {currentView}:
      </Typography>
      <TextField
        sx={{ width: "100%", mb: 1 }}
        value={queryValue}
        type="number"
        inputProps={{
          step: 50,
          min: 0,
          max: 4000,
          type: "number",
          "aria-labelledby": "input-slider",
        }}
        onKeyUp={handleInputEnter}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
      <Box sx={{ ml: 1 }}>
        <Slider
          value={
            typeof Number(queryValue) === "number" ? Number(queryValue) : 30
          }
          aria-labelledby="input-slider"
          getAriaValueText={valuetext}
          min={30}
          max={4000}
          marks={marks}
          onChange={(event, value) => setQueryValue(value)}
          onChangeCommitted={(event, value) => handleSliderChange(value)}
        />
      </Box>
    </Box>
  );
}
