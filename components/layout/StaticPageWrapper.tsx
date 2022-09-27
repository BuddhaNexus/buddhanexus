import React from "react";
import { Footer } from "@components/layout/Footer";
import { Container, Paper } from "@mui/material";

export const StaticPageWrapper: React.FC = ({
  children,
}: React.PropsWithChildren) => (
  <>
    <Container component="main" maxWidth="md">
      <Paper elevation={1} sx={{ py: 3, px: 4, mt: 8, mb: 4 }}>
        {children}
      </Paper>
    </Container>
    <Footer />
  </>
);
