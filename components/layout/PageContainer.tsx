import type { FC, PropsWithChildren } from "react";
import { Container } from "@mui/material";
import bgPali from "public/assets/images/pli_bg_optimized-min.jpeg";
import type { SourceLanguage } from "utils/constants";

interface Props extends PropsWithChildren {
  sourceLanguage?: SourceLanguage;
}

export const PageContainer: FC<Props> = ({ children, sourceLanguage }) => (
  <>
    {sourceLanguage && (
      <Container
        maxWidth={false}
        sx={{
          background: `url(${bgPali.src})`,
          height: "100%",
          width: "100%",
          position: "fixed",
          backgroundSize: "contain",
          zIndex: -1,
          opacity: 0.3,
        }}
      />
    )}
    <Container
      component="main"
      maxWidth="md"
      sx={{ pt: 8, flex: 1, display: "flex", flexDirection: "column" }}
    >
      {children}
    </Container>
  </>
);
