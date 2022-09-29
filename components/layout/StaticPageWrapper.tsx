import React from "react";
import { Footer } from "@components/layout/Footer";
import { StaticPageBackground } from "@components/layout/StaticPageBackground";
import { Container, Paper } from "@mui/material";

export const StaticPageWrapper: React.FC = ({
  children,
}: React.PropsWithChildren) => (
  <>
    <StaticPageBackground />
    <Container component="main" maxWidth="md">
      <Paper elevation={1} sx={{ py: 3, px: 4, mt: 8, mb: 4 }}>
        {children}
      </Paper>
    </Container>
    <Footer />
  </>
);
