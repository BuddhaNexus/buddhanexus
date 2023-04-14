import React, { memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/system";
import { isGolbalSearchDialogOpen } from "features/atoms/layout";
import { useAtom } from "jotai";

export const GlobalTextSearch = memo(function GlobalTextSearch() {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isGolbalSearchDialogOpen);

  const handleSerach = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        PaperProps={{
          style: {
            position: "absolute",
            top: "10%",
            width: "100%",
          },
        }}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <TextField
              margin="dense"
              id="search-text"
              label="Search"
              type="text"
              variant="standard"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              fullWidth
            />
            <Button variant="contained" onClick={handleSerach}>
              Search
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
});
