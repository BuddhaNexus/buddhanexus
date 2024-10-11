import React from "react";
import { Footer } from "@components/layout/Footer";
import { PageContainer } from "@components/layout/PageContainer";
import { Paper } from "@mui/material";

export const StaticPageWrapper: React.FC = ({
  children,
}: React.PropsWithChildren) => (
  <>
    <PageContainer backgroundName="welcome">
      <Paper elevation={1} sx={{ py: 3, px: 4, mt: 8, mb: 4 }}>
        {children}
      </Paper>
    </PageContainer>
    <Footer />
  </>
);
