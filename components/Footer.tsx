import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { Copyright } from "./Copyright";

const footers = [
  {
    title: "Company",
    description: ["Team", "History", "Contact us", "Locations"],
  },
  {
    title: "Features",
    description: [
      "Cool stuff",
      "Random feature",
      "Team feature",
      "Developer stuff",
      "Another one",
    ],
  },
  {
    title: "Resources",
    description: [
      "Resource",
      "Resource name",
      "Another resource",
      "Final resource",
    ],
  },
  {
    title: "Legal",
    description: ["Privacy policy", "Terms of use"],
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
      {footers.map((footer) => (
        <Grid key={footer.title} xs={6} sm={3} item>
          <Typography variant="h6" color="text.primary" gutterBottom>
            {footer.title}
          </Typography>
          <ul>
            {footer.description.map((item) => (
              <li key={item}>
                <Link href="#" variant="subtitle1" color="text.secondary">
                  {item}
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
