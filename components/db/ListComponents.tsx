import { useTranslation } from "next-i18next";
import { Typography } from "@mui/material";

export const Footer = () => {
  const { t } = useTranslation("common");

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography>{t("prompts.loading")}</Typography>
    </div>
  );
};

export const EmptyPlaceholder = () => {
  const { t } = useTranslation("common");

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography>{t("prompts.noResults")}</Typography>
    </div>
  );
};
