import type { FC, PropsWithChildren } from "react";
import {
  Box,
  Breakpoint,
  Container,
  LinearProgress,
  SxProps,
} from "@mui/material";
import bgChn from "@public/assets/images/bg_chn_upscaled_bw.jpg";
import bgPli from "@public/assets/images/bg_pli_upscaled_bw.jpg";
import bgSkt from "@public/assets/images/bg_skt_upscaled_bw.jpg";
import bgTib from "@public/assets/images/bg_tib_upscaled_bw.jpg";
import bgWelcome from "@public/assets/images/bg_welcome_upscaled_bw.jpg";
import { DbLanguage } from "@utils/api/types";
import type { Property } from "csstype";

import { QueryResultsPageContent } from "./QueryResultsPageContent";

export type BackgroundName = DbLanguage | "welcome";

const BgImageSrcs: Record<BackgroundName, string> = {
  bo: bgTib.src,
  zh: bgChn.src,
  pa: bgPli.src,
  sa: bgSkt.src,
  welcome: bgWelcome.src,
};

const BgImageBgSize: Record<BackgroundName, Property.BackgroundSize> = {
  bo: "contain",
  zh: "contain",
  pa: "contain",
  sa: "contain",
  welcome: "cover",
};

interface Props extends PropsWithChildren {
  backgroundName?: BackgroundName;
  maxWidth?: Breakpoint | false;
  isQueryResultsPage?: boolean;
  isLoading?: boolean;
}

export const PageContainer: FC<Props> = ({
  children,
  backgroundName,
  maxWidth = "md",
  isQueryResultsPage,
  isLoading,
}) => {
  const containerStyles: SxProps = {
    pt: { xs: 0, sm: 4 },
    px: { xs: 0, sm: 2, lg: 1 },
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      {backgroundName && (
        <Container
          maxWidth={false}
          sx={(theme) => ({
            background: `url(${BgImageSrcs[backgroundName]})`,
            backgroundPosition: "center",
            backgroundSize: BgImageBgSize[backgroundName],
            opacity: 0.05,
            // @ts-expect-error MUI css variable type mismatch
            [theme.getColorSchemeSelector("dark")]: {
              opacity: 0.02,
            },
            height: "100%",
            minWidth: "100vw",
            position: "fixed",
            zIndex: -1,
          })}
        />
      )}
      {isQueryResultsPage ? (
        <QueryResultsPageContent
          maxWidth={maxWidth}
          containerStyles={containerStyles}
        >
          {children}
        </QueryResultsPageContent>
      ) : (
        <Container component="main" maxWidth={maxWidth} sx={containerStyles}>
          {children}
        </Container>
      )}
      {isLoading ? <LinearProgress /> : <Box sx={{ height: 4 }} />}
    </>
  );
};
