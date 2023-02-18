import * as React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export default function TextScriptOption() {
  const [value, setValue] = React.useState("wylie");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //  TODO: handle script change
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <FormLabel id="tibetan-script-selection-label">Script</FormLabel>
      <RadioGroup
        row={true}
        aria-labelledby="tibetan-script-selection-label"
        name="tibetan-script-selection-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="wylie" control={<Radio />} label="Wylie" />
        <FormControlLabel value="unicode" control={<Radio />} label="Unicode" />
      </RadioGroup>
    </FormControl>
  );
}
