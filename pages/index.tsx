import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Footer } from "@components/Footer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Container component="main" maxWidth="md" sx={{ pt: 8, pb: 6, flex: 1 }}>
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
        variant="h5"
        align="center"
        color="text.secondary"
        component="p"
      >
        Site description
      </Typography>

      <Footer />
    </Container>
  );
}

export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}
