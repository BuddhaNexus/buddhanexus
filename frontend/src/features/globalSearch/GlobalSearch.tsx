import React, { memo, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";

import GlobalSearchDesktopInput from "./GlobalSearchDesktopInput";
import GlobalSearchMobileInput from "./GlobalSearchMobileInput";
import { GlobalSearchBox } from "./GlobalSearchStyledMuiComponents";
import SearchToggleButton from "./SearchToggleButton";

const GlobalSearch = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (isDesktop) {
    return (
      <GlobalSearchBox>
        <SearchToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
        <GlobalSearchDesktopInput isOpen={isOpen} setIsOpen={setIsOpen} />
      </GlobalSearchBox>
    );
  }

  return (
    <GlobalSearchBox>
      <SearchToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      <Dialog
        open={isOpen}
        maxWidth="xl"
        PaperProps={{
          sx: {
            position: "fixed",
            top: {
              xs: "1.75rem",
              sm: "2.5rem",
            },
            insetInline: "0",
            marginInline: {
              xs: "0",
              sm: "1rem",
            },
          },
        }}
        aria-labelledby="search-dialog-title"
        onClose={() => setIsOpen(false)}
      >
        <GlobalSearchMobileInput isOpen={isOpen} setIsOpen={setIsOpen} />
      </Dialog>
    </GlobalSearchBox>
  );
};

export default memo(GlobalSearch);
