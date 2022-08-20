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
      borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      mt: 8,
      py: [3, 6],
    }}
  >
    <Grid spacing={4} justifyContent="space-evenly" container>
      {footerData.map((footer) => (
        <Grid key={footer.title} xs={6} sm={3} item>
          <Typography variant="h6" color="text.primary" gutterBottom>
            {footer.title}
          </Typography>
          <ul>
            {footer.links.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.url}
                  variant="subtitle1"
                  color="text.secondary"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>
      ))}
    </Grid>
    <Copyright sx={{ mt: 5 }} />
  </Container>
);
