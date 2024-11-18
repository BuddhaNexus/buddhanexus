import { TreeHeading } from "@components/db/SearchableDbSourceTree/treeComponents/TreeHeading";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import { DbLanguage } from "@utils/api/types";

export type InactiveTreeHeadProps = {
  hasHeading: boolean;
  dbLanguage: DbLanguage;
  padding?: number;
};

function InactiveTreeHead({
  hasHeading,
  dbLanguage,
  padding,
}: InactiveTreeHeadProps) {
  return (
    <>
      <TreeHeading isRendered={hasHeading} dbLanguage={dbLanguage} />
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
