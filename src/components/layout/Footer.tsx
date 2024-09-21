import { useMemo } from "react";
import { useRouter } from "next/router";
import type { TFunction } from "next-i18next";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { SupportedLocale } from "types/i18next";

import { Copyright } from "./Copyright";

type FooterSection = {
  title: string;
  links: {
    title: string;
    slug: string;
  }[];
};

const getFooterData: (
  t: TFunction,
  locale: SupportedLocale,
) => FooterSection[] = (t) => [
  {
    title: t("footer.about"),
    links: [
      { title: t("footer.introduction"), slug: "/introduction" },
      { title: t("footer.history"), slug: "/history" },
      { title: t("footer.guide"), slug: "/guide" },
      { title: t("footer.contact"), slug: "/contact" },
    ],
  },
  {
    title: t("footer.community"),
    links: [
      { title: t("footer.institutions"), slug: "/institutions" },
      { title: t("footer.people"), slug: "/people" },
      { title: t("footer.news"), slug: "/news" },
    ],
  },
  {
    title: t("footer.activities"),
    links: [
      { title: t("footer.publications"), slug: "/publications" },
      { title: t("footer.events"), slug: "/events" },
      { title: t("footer.projects"), slug: "/projects" },
      { title: t("footer.presentations"), slug: "/presentations" },
    ],
  },
];

export const Footer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale as SupportedLocale;

  const footerData = useMemo(() => getFooterData(t, locale), [t, locale]);

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
          <Grid key={footer.title} xs={12} sm="auto" item>
            <Typography
              component="h2"
              variant="h6"
              color="text.primary"
              gutterBottom
            >
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
                  <Link href={item.slug}>{item.title}</Link>
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
