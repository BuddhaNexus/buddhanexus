import type { FC, PropsWithChildren } from "react";
import { Container } from "@mui/material";

export const PageContainer: FC<PropsWithChildren> = ({ children }) => (
  <Container
    component="main"
    maxWidth="md"
    sx={{
      pt: 8,
      flex: 1,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </Container>
);
