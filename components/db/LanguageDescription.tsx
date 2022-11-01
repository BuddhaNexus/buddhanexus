import React from "react";
import { useTranslation } from "next-i18next";
import { Typography } from "@mui/material";
import { SourceLanguage } from "utils/constants";

const PaliLanguageDescription = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        {t("dbPli:p01")}
      </Typography>

      <Typography>{t("dbPli:p02")}</Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("dbPli:p03")}
      </Typography>

      <Typography>{t("dbPli:p04")}</Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("dbPli:p05")}
      </Typography>
    </>
  );
};

export const LanguageDescription = ({ lang }: { lang: SourceLanguage }) => {
  if (lang === SourceLanguage.PALI) {
    return <PaliLanguageDescription />;
  }
  // TODO: add descriptions for all source languages
  return null;
};
