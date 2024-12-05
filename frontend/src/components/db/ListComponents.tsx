import { useTranslation } from "next-i18next";
import { Divider, LinearProgress, Typography } from "@mui/material";

export const ListDivider = () => (
  <Divider variant="middle" sx={{ m: 1, mt: 2 }} />
);

export const ListLoadingIndicator = () => <LinearProgress />;

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
