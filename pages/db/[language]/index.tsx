import React from "react";
import { useSourceLanguage } from "@components/hooks/useSourceLanguage";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper, Typography } from "@mui/material";

export {
  getSourceLanguageStaticPaths as getStaticPaths,
  getI18NextStaticProps as getStaticProps,
} from "utils/common";

export default function SamplePage() {
  const { languageName } = useSourceLanguage();

  return (
    <PageContainer>
      <Paper elevation={1} sx={{ py: 3, px: 4 }}>
        <Typography variant="h1">{languageName}</Typography>
      </Paper>
      <Footer />
    </PageContainer>
  );
}
