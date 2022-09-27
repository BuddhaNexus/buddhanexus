import React from "react";
import { useTranslation } from "next-i18next";
import { Footer } from "@components/Footer";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getI18NextStaticProps } from "utils/common";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ pt: 8, flex: 1, display: "flex", flexDirection: "column" }}
    >
      <Box
        component="img"
        src="/assets/icons/full-logo.svg"
        width="100%"
        height="30vh"
        alt="buddhanexus logo"
        sx={{
          filter: "drop-shadow(2px 2px 1px rgba(54,31,13,0.25))",
        }}
      />
      <Paper elevation={1} sx={{ p: 4, m: 4 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          {t("global.siteTitle")}
        </Typography>
        <Typography align="center">
          A database devoted to the study of Buddhist texts and literary corpora
          in Pāli, Sanskrit, Tibetan, and Chinese, with particular emphasis on
          evolution of scriptures, formation of canons, and intellectual
          networks.
        </Typography>
      </Paper>
      <Footer />
    </Container>
  );
}

export async function getStaticProps({ locale }: { locale: any }) {
  return getI18NextStaticProps({ locale });
}
