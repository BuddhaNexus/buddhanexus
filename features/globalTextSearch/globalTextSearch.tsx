import React, { memo } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/system";
import { isGolbalSearchDialogOpen } from "features/atoms/layout";
import { useAtom } from "jotai";

// TODO
const handleSerach = () => null;

const SearchFilters = memo(function DialogFilters() {
  return (
    <Stack direction="row" spacing={2}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Include collection
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Include collection"
        >
          <MenuItem>Collection 1</MenuItem>
          <MenuItem>Collection 2</MenuItem>
          <MenuItem>Collection 3</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Exclude collection
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Include collection"
        >
          <MenuItem>Collection 1</MenuItem>
          <MenuItem>Collection 2</MenuItem>
          <MenuItem>Collection 3</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Include text</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Include text"
        >
          <MenuItem>Text 1</MenuItem>
          <MenuItem>Text 2</MenuItem>
          <MenuItem>Text 3</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Exclude text</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Include text"
        >
          <MenuItem>Text 1</MenuItem>
          <MenuItem>Text 2</MenuItem>
          <MenuItem>Text 3</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
});

const SearchBox = memo(function SearchDialog() {
  return (
    <Stack direction="row" mb={4} spacing={2}>
      <TextField
        id="global-search-input"
        type="search"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        fullWidth
      />
      <Button variant="contained" onClick={handleSerach}>
        Search
      </Button>
    </Stack>
  );
});

export const GlobalTextSearch = memo(function GlobalTextSearch() {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isGolbalSearchDialogOpen);

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        fullWidth={true}
        maxWidth="lg"
        PaperProps={{
          style: {
            position: "absolute",
            top: "42px",
            padding: "24px",
          },
        }}
        // TODO confirm if this is needed in production. (see: https://github.com/mui/material-ui/issues/33330)
        disableRestoreFocus
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogContent>
          <SearchBox />
          <SearchFilters />
        </DialogContent>
      </Dialog>
    </div>
  );
});
