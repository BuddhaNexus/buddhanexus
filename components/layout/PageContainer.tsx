import type { FC, PropsWithChildren } from "react";
import { Container } from "@mui/material";
import bgChn from "@public/assets/images/bg_chn_upscaled.jpeg";
import bgPli from "@public/assets/images/bg_pli_upscaled.jpeg";
import bgSkt from "@public/assets/images/bg_skt_upscaled.jpeg";
import bgTib from "@public/assets/images/bg_tib_upscaled.jpeg";
import { SourceLanguage } from "utils/constants";

const BgImageSrcs = {
  [SourceLanguage.TIBETAN]: bgTib.src,
  [SourceLanguage.CHINESE]: bgChn.src,
  [SourceLanguage.SANSKRIT]: bgSkt.src,
  [SourceLanguage.PALI]: bgPli.src,
};

const BgImageOpacities = {
  [SourceLanguage.TIBETAN]: 0.1,
  [SourceLanguage.CHINESE]: 0.35,
  [SourceLanguage.SANSKRIT]: 0.2,
  [SourceLanguage.PALI]: 0.2,
};

interface Props extends PropsWithChildren {
  sourceLanguage?: SourceLanguage;
}

export const PageContainer: FC<Props> = ({ children, sourceLanguage }) => {
  return (
    <>
      {sourceLanguage && (
        <Container
          maxWidth={false}
          sx={{
            background: `url(${BgImageSrcs[sourceLanguage]})`,
            height: "100%",
            width: "100%",
            position: "fixed",
            backgroundSize: "contain",
            zIndex: -1,
            opacity: BgImageOpacities[sourceLanguage],
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
