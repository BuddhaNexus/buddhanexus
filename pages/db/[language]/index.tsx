import React from "react";
import { useTranslation } from "next-i18next";
import { useSourceLanguage } from "@components/hooks/useSourceLanguage";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";

export {
  getSourceLanguageStaticPaths as getStaticPaths,
  getI18NextStaticProps as getStaticProps,
} from "utils/common";

export default function SamplePage() {
  const language = useSourceLanguage();
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        {/* @ts-expect-error i18n types are not that smart!*/}
        <Typography variant="h1">{t(`language.${language}`)}</Typography>
      </Paper>
      <Footer />
    </PageContainer>
  );
}
