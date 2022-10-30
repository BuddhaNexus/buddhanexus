import type { FC, PropsWithChildren } from "react";
import { Container } from "@mui/material";
import bgChn from "@public/assets/images/bg_chn_upscaled.jpeg";
import bgPli from "@public/assets/images/bg_pli_upscaled.jpeg";
import bgSkt from "@public/assets/images/bg_skt_upscaled.jpeg";
import bgTib from "@public/assets/images/bg_tib_upscaled.jpeg";
import bgWelcome from "@public/assets/images/bg_welcome_upscaled.jpeg";
import type { Property } from "csstype";
import { SourceLanguage } from "utils/constants";

const BgImageSrcs: Record<BackgroundName, string> = {
  [SourceLanguage.TIBETAN]: bgTib.src,
  [SourceLanguage.CHINESE]: bgChn.src,
  [SourceLanguage.SANSKRIT]: bgSkt.src,
  [SourceLanguage.PALI]: bgPli.src,
  welcome: bgWelcome.src,
};

const BgImageOpacities: Record<BackgroundName, number> = {
  [SourceLanguage.TIBETAN]: 0.1,
  [SourceLanguage.CHINESE]: 0.35,
  [SourceLanguage.SANSKRIT]: 0.2,
  [SourceLanguage.PALI]: 0.2,
  welcome: 0.2,
};

const BgImageBgSize: Record<BackgroundName, Property.BackgroundSize> = {
  [SourceLanguage.TIBETAN]: "contain",
  [SourceLanguage.CHINESE]: "contain",
  [SourceLanguage.SANSKRIT]: "contain",
  [SourceLanguage.PALI]: "contain",
  welcome: "cover",
};

type BackgroundName = SourceLanguage | "welcome";

interface Props extends PropsWithChildren {
  backgroundName?: BackgroundName;
}

export const PageContainer: FC<Props> = ({ children, backgroundName }) => {
  return (
    <>
      {backgroundName && (
        <Container
          maxWidth={false}
          sx={{
            background: `url(${BgImageSrcs[backgroundName]})`,
            backgroundSize: BgImageBgSize[backgroundName],
            opacity: BgImageOpacities[backgroundName],
            height: "100%",
            width: "100%",
            position: "fixed",
            zIndex: -1,
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
};
