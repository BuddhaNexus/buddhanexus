import { useTranslation } from "next-i18next";
import { CircularProgress, Typography } from "@mui/material";

export const ListLoadingIndicator = () => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
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
