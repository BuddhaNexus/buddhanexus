import { useTranslation } from "next-i18next";
import { CircularProgress, Divider, Typography } from "@mui/material";

export const ListDivider = () => <Divider />;

export const ListLoadingIndicator = () => (
  <div
    style={{
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      width: "100%",
    }}
  >
    <CircularProgress />
  </div>
);

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
