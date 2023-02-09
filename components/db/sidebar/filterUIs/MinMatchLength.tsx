import { useState } from "react";
import { useParallels } from "@components/db/sidebar/filters";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function MinMatchLengthFilter({
  sourceLang,
  currentView,
}: {
  sourceLang: string;
  currentView: string;
}) {
  const { queryParams } = useParallels();

  const [value, setValue] = useState<(number | string)[] | number | string>(
    Number(queryParams.par_length)
  );

  const handleSliderChange = (event: Event, newValue: number[] | number) => {
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 272 }}>
      <Typography id="input-slider" gutterBottom>
        Min. Match Length for {sourceLang} in {currentView}:
      </Typography>
      <Grid spacing={2} alignItems="center" container>
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            aria-labelledby="input-slider"
            onChange={handleSliderChange}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
