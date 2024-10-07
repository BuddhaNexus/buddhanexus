import { TreeHeading } from "@components/db/SearchableDbSourceTree/treeComponents/TreeHeading";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import { SourceLanguage } from "@utils/constants";

export type InactiveTreeHeadProps = {
  hasHeading: boolean;
  sourceLanguage: SourceLanguage;
  padding?: number;
};

function InactiveTreeHead({
  hasHeading,
  sourceLanguage,
  padding,
}: InactiveTreeHeadProps) {
  return (
    <>
      <TreeHeading isRendered={hasHeading} sourceLanguage={sourceLanguage} />
      <FormControl variant="outlined" sx={{ p: padding, pb: 0 }} fullWidth>
        <TextField
          label="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          disabled
        />
      </FormControl>
    </>
  );
}

export default InactiveTreeHead;
