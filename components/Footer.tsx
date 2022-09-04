import { useMemo } from "react";
import type { TFunction } from "next-i18next";
import { useTranslation } from "next-i18next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { Copyright } from "./Copyright";

type FooterSection = {
  title: string;
  links: {
    title: string;
    url: string;
  }[];
};

const getFooterData: (t: TFunction) => FooterSection[] = (t) => [
  {
    title: t("footer.about"),
    links: [
      { title: t("footer.introduction"), url: "/introduction" },
      { title: t("footer.history"), url: "/history" },
      { title: t("footer.guidelines"), url: "/guidelines" },
    ],
  },
  {
    title: t("footer.community"),
    links: [
      { title: t("footer.institutions"), url: "/institutions" },
      { title: t("footer.people"), url: "/people" },
      { title: t("footer.news"), url: "/news" },
    ],
  },
  {
    title: t("footer.activities"),
    links: [
      { title: t("footer.publications"), url: "/publications" },
      { title: t("footer.events"), url: "/events" },
      { title: t("footer.projects"), url: "/projects" },
      { title: t("footer.presentations"), url: "/presentations" },
    ],
  },
];

export const Footer = () => {
  const { t } = useTranslation();

  const footerData = useMemo(() => getFooterData(t), [t]);

  return (
    <Container
      maxWidth="md"
      component="footer"
      sx={{
        py: [4, 6],
        justifyContent: "flex-end",
        flexDirection: "column",
        display: "flex",
        flex: 1,
      }}
    >
      <Grid
        justifyContent="space-evenly"
        rowSpacing={4}
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          textAlign: {
            xs: "center",
            sm: "unset",
          },
        }}
        container
      >
        {footerData.map((footer) => (
          <Grid key={footer.title} xs={6} sm="auto" item>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {footer.title}
            </Typography>
            <Container
              component="ul"
              sx={{ listStyleType: "none", paddingLeft: { sm: 0 } }}
            >
              {footer.links.map((item) => (
                <Container
                  key={item.title}
                  component="li"
                  sx={{ mt: { xs: 1 } }}
                >
                  <Link
                    href={item.url}
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    {item.title}
                  </Link>
                </Container>
              ))}
            </Container>
          </Grid>
        ))}
      </Grid>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};
