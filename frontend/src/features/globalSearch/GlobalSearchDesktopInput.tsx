import React, { useEffect, useRef } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import { AppTopBarSearchBoxWrapper } from "./GlobalSearchStyledMuiComponents";
import SearchInput from "./SearchInput";

type GlobalSearchDesktopInputProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalSearchDesktopInput = ({
  isOpen,
  setIsOpen,
}: GlobalSearchDesktopInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <AppTopBarSearchBoxWrapper isOpen={isOpen}>
      <SearchInput
        ref={inputRef}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerAdornmentIcon={<KeyboardReturnIcon />}
      />
    </AppTopBarSearchBoxWrapper>
  );
};

export default GlobalSearchDesktopInput;
