import React from "react";
import { Container, Paper } from "@mui/material";
import { Footer } from "components/Footer";

export const StaticPageWrapper: React.FC = ({
  children,
}: React.PropsWithChildren) => (
  <>
    <Container component="main" maxWidth="md">
      <Paper sx={{ py: 3, px: 4, mt: 8, mb: 4 }}>{children}</Paper>
    </Container>
    <Footer />
  </>
);
