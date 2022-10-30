import { PageContainer } from "@components/layout/PageContainer";

export { getI18NextStaticProps as getStaticProps } from "utils/common";

import React from "react";
import { useTranslation } from "next-i18next";
import { ContentLanguageSelector } from "@components/layout/ContentLanguageSelector";
import { Footer } from "@components/layout/Footer";
import { serifFontFamily } from "@components/theme";
import { Paper, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme as useMaterialTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { SourceLanguage } from "../utils/constants";

export default function Home() {
  const { t } = useTranslation();

  const theme = useTheme();
  const materialTheme = useMaterialTheme();

  return (
    <PageContainer backgroundName="welcome">
      <Box
        component="img"
        src="/assets/icons/full-logo.svg"
        height="30vh"
        alt="buddhanexus logo"
        sx={{
          p: 4,
          [materialTheme.breakpoints.down("sm")]: {
            p: 3,
            m: 2,
          },
          backgroundColor: "#361F0D",
          filter: "drop-shadow(2px 2px 1px rgba(0,0,0,0.25))",
          borderRadius: 1,
        }}
      />
      <Paper
        elevation={1}
        sx={{
          p: 4,
          mt: 2,
          mb: 4,
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
            title="Pāli"
            href={`/db/${SourceLanguage.PALI}`}
            color={theme.palette.common.pali}
          />
          <ContentLanguageSelector
            title="Sanskrit"
            href={`/db/${SourceLanguage.SANSKRIT}`}
            color={theme.palette.common.sanskrit}
          />
          <ContentLanguageSelector
            title="Tibetan"
            href={`/db/${SourceLanguage.TIBETAN}`}
            color={theme.palette.common.tibetan}
          />
          <ContentLanguageSelector
            title="Chinese"
            href={`/db/${SourceLanguage.CHINESE}`}
            color={theme.palette.common.chinese}
          />
        </Box>
      </Paper>
      <Footer />
    </PageContainer>
  );
}
