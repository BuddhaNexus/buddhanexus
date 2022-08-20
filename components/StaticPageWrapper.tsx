import React from "react";
import { Container, Paper } from "@mui/material";
import { Footer } from "components/Footer";

export const StaticPageWrapper: React.FC = ({
  children,
}: React.PropsWithChildren) => (
  <>
    <Container fixed>
      <Paper sx={{ my: 4, px: 4, py: 2 }}>{children}</Paper>
    </Container>
    <Footer />
  </>
);
