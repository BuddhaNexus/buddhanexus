import { useTranslation } from "next-i18next";
import { Box, Paper, Typography } from "@mui/material";

export function ResultQueryError({ errorMessage }: { errorMessage?: string }) {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        display: "grid",
        placeItems: "center",
        minHeight: { md: "55dvh" },
        p: 2,
        mt: 2,
        backgroundColor: "background.paper",
        color: "error.main",
      }}
    >
      <Box
        sx={{
          transform: { md: "translateY(-25%)" },
        }}
      >
        <Typography variant="h2" component="h2" sx={{ pb: 1 }}>
          {t("prompts.genericErrorTitle")}
        </Typography>

        {errorMessage && (
          <Typography variant="h5" component="p" sx={{ pb: 0.75 }}>
            {t("prompts.fetchError")}: {errorMessage}
          </Typography>
        )}

        <Typography variant="h5" component="p">
          {t("prompts.genericErrorDescription")}
        </Typography>
      </Box>
    </Paper>
  );
}
