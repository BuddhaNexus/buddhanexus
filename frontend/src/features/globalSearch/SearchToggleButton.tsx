import React from "react";
import { useTranslation } from "next-i18next";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import IconButton from "@mui/material/IconButton";

type SearchToggleButtonProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchToggleButton = ({ isOpen, setIsOpen }: SearchToggleButtonProps) => {
  const { t } = useTranslation();

  return (
    <IconButton
      color="inherit"
      aria-label={t("search.toggleSearch")}
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? (
        <SearchOffIcon sx={{ fontSize: 28 }} />
      ) : (
        <SearchIcon sx={{ fontSize: 28 }} />
      )}
    </IconButton>
  );
};

export default SearchToggleButton;
