import { useTranslation } from "next-i18next";
import type { BackgroundName } from "@components/layout/PageContainer";
import { PageContainer } from "@components/layout/PageContainer";
import { Typography } from "@mui/material";

export function ErrorPage({
  backgroundName,
}: {
  backgroundName: BackgroundName;
}) {
  const { t } = useTranslation();

  return (
    <PageContainer backgroundName={backgroundName}>
      <Typography variant="h1">Error</Typography>
      <Typography variant="h3" sx={{ py: 2 }}>
        {t("prompts.genericErrorTitle")}
      </Typography>
      <Typography variant="body1">
        {t("prompts.genericErrorDescription")}
      </Typography>
    </PageContainer>
  );
}
