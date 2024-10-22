import React from "react";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { ContentLanguageSelector } from "@components/layout/ContentLanguageSelector";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { sourceSerif } from "@components/theme";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { DbLanguage } from "@utils/api/types";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import merge from "lodash/merge";

const dbLanguagePaths: Record<DbLanguage, string> = {
  bo: "/db/bo",
  pa: "/db/pa",
  sa: "/db/sa",
  zh: "/db/zh",
};

export default function Home() {
  const { t } = useTranslation();

  const materialTheme = useTheme();

  return (
    <PageContainer backgroundName="welcome">
      <Box
        component="img"
        src="/assets/logos/bn_full_logo.svg"
        height="30vh"
        alt="buddhanexus logo"
        sx={{
          p: 4,
          [materialTheme.breakpoints.down("sm")]: {
            p: 3,
            m: 2,
          },
          backgroundColor: materialTheme.palette.background.header,
          borderBottom: `1px solid ${materialTheme.palette.background.accent}`,
          borderRadiusTopLeft: 1,
          borderRadiusTopRights: 1,
        }}
      />
      <Paper
        elevation={1}
        sx={{
          p: 4,
          mt: 0,
          mb: 4,
          [materialTheme.breakpoints.down("sm")]: {
            p: 3,
            mx: 2,
            mb: 2,
          },
        }}
      >
        <Typography component="h1" sx={visuallyHidden}>
          {t("global.siteTitle")}
        </Typography>
        <Typography
          align="center"
          variant="body1"
          sx={{ fontFamily: sourceSerif.style.fontFamily }}
        >
          {t("home:intro")}
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
            href={dbLanguagePaths.pa}
            color={materialTheme.palette.common.pali}
          />
          <ContentLanguageSelector
            title="Sanskrit"
            href={dbLanguagePaths.sa}
            color={materialTheme.palette.common.sanskrit}
          />
          <ContentLanguageSelector
            title="Tibetan"
            href={dbLanguagePaths.bo}
            color={materialTheme.palette.common.tibetan}
          />
          <ContentLanguageSelector
            title="Chinese"
            href={dbLanguagePaths.zh}
            color={materialTheme.palette.common.chinese}
          />
        </Box>
      </Paper>
      <Footer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["home"],
  );

  const queryClient = new QueryClient();

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
