import React from "react";
import { useTranslation } from "next-i18next";
import { ContentLanguageSelector } from "@components/layout/ContentLanguageSelector";
import { Footer } from "@components/layout/Footer";
import { serifFontFamily } from "@components/theme";
import { Paper, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme as useMaterialTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { getI18NextStaticProps } from "utils/common";

export default function Home() {
  const { t } = useTranslation();

  const theme = useTheme();
  const materialTheme = useMaterialTheme();

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
          filter: "drop-shadow(2px 2px 1px rgba(0,0,0,0.25))",
        }}
      />
      <Paper
        elevation={1}
        sx={{
          p: 4,
          m: 4,
          [materialTheme.breakpoints.down("sm")]: {
            p: 3,
            m: 2,
          },
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          {t("global.siteTitle")}
        </Typography>
        <Typography
          align="center"
          variant="body1"
          sx={{ fontFamily: serifFontFamily }}
        >
          A database devoted to the study of Buddhist texts and literary corpora
          in Pāli, Sanskrit, Tibetan, and Chinese, with particular emphasis on
          evolution of scriptures, formation of canons, and intellectual
          networks.
        </Typography>

        <Box
          sx={{
            display: "flex",
            my: 2,
            flexWrap: "wrap",
            [materialTheme.breakpoints.down("sm")]: {
              flexDirection: "column",
            },
          }}
        >
          <ContentLanguageSelector
            title="Pali"
            href="/pali"
            color={theme.palette.common.pali}
          />
          <ContentLanguageSelector
            title="Sanskrit"
            href="/sanskrit"
            color={theme.palette.common.sanskrit}
          />
          <ContentLanguageSelector
            title="Tibetan"
            href="/tibetan"
            color={theme.palette.common.tibetan}
          />
          <ContentLanguageSelector
            title="Chinese"
            href="/chinese"
            color={theme.palette.common.chinese}
          />
        </Box>
      </Paper>
      <Footer />
    </Container>
  );
}

export async function getStaticProps({ locale }: { locale: any }) {
  return getI18NextStaticProps({ locale });
}
