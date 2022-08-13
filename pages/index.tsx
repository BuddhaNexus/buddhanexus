import React from "react";
import { Footer } from "@components/Footer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Container component="main" maxWidth="md" sx={{ pt: 8, pb: 6, flex: 1 }}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Pricing
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component="p"
      >
        Quickly build an effective pricing table for your potential customers
        with this layout. It&apos;s built with default MUI components with
        little customization.
      </Typography>

      <Footer />
    </Container>
  );
}
