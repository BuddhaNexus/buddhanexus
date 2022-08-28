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

const footerData: FooterSection[] = [
  {
    title: "About",
    links: [
      { title: "Introduction", url: "/introduction" },
      { title: "History", url: "/history" },
      { title: "Guidelines", url: "/guidelines" },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "Institutions", url: "/institutions" },
      { title: "People", url: "/people" },
      { title: "News", url: "/news" },
    ],
  },
  {
    title: "Activities",
    links: [
      { title: "Publications", url: "/publications" },
      { title: "Events", url: "/events" },
      { title: "Projects", url: "/projects" },
      { title: "Presentations", url: "/presentations" },
    ],
  },
];

export const Footer = () => (
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
              <Container key={item.title} component="li" sx={{ mt: { xs: 1 } }}>
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
