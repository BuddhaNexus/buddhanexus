import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LanguageDescription } from "@components/db/LanguageDescription";
import { useSourceLanguage } from "@components/hooks/useSourceLanguage";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";

export { getSourceLanguageStaticPaths as getStaticPaths } from "utils/common";

export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dbPli"])),
    },
  };
}

export default function SamplePage() {
  const { sourceLanguageName, sourceLanguage } = useSourceLanguage();

  return (
    <PageContainer backgroundName={sourceLanguage}>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h1">{sourceLanguageName}</Typography>
        <LanguageDescription lang={sourceLanguage} />
      </Paper>
      <Footer />
    </PageContainer>
  );
}
