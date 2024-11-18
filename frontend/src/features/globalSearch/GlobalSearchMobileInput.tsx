import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { AppTopBarSearchBoxWrapper } from "./GlobalSearchStyledMuiComponents";
import SearchInput from "./SearchInput";

type GlobalSearchMobileInputProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalSearchMobileInput = ({
  isOpen,
  setIsOpen,
}: GlobalSearchMobileInputProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <DialogTitle id="search-dialog-title">
        {t("search.dialogTitle")}
      </DialogTitle>
      <DialogContent>
        <AppTopBarSearchBoxWrapper isOpen={isOpen}>
          <SearchInput
            ref={inputRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerAdornmentIcon={<KeyboardReturnIcon />}
          />
        </AppTopBarSearchBoxWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>{t("prompts.close")}</Button>
      </DialogActions>
    </>
  );
};

export default GlobalSearchMobileInput;
