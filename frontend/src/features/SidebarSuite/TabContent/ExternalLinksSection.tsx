import React from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { SourceLink } from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import { List, ListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import BDRCLogo from "public/assets/logos/bdrc.png";
import BDRCLogoLight from "public/assets/logos/bdrc_light.png";
import CBETALogo from "public/assets/logos/cbeta.png";
import DSBCLogo from "public/assets/logos/dsbc.png";
import GRETILLogo from "public/assets/logos/gretil.png";
import GRETILLogoLight from "public/assets/logos/gretil_light.png";
import RKTSLogo from "public/assets/logos/rkts.png";
import RKTSLogoLight from "public/assets/logos/rkts_light.png";
import SCLogo from "public/assets/logos/sc.png";
import VRILogo from "public/assets/logos/vri.png";

function CBCIcon({ fill }: { fill: string }) {
  return (
    <div
      style={{
        border: "1px solid #aaa",
        borderRadius: "4px",
        overflow: "hidden",
        display: "inline-block",
        width: "48px",
        height: "32px",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32">
        <text
          x="24"
          y="16"
          fontSize="16"
          fill={fill}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          CBC@
        </text>
      </svg>
    </div>
  );
}

export const ExternalLinksSection = () => {
  const { fileName } = useDbRouterParams();
  const { t } = useTranslation("settings");
  const materialTheme = useTheme();

  const { data } = useQuery({
    queryKey: [DbApi.ExternalLinksData.makeQueryKey(fileName)],
    queryFn: () => DbApi.ExternalLinksData.call({ filename: fileName }),
  });

  const isDarkTheme = materialTheme.palette.mode === "dark";

  const logos = React.useMemo<Record<string, StaticImageData>>(() => {
    return {
      bdrc: isDarkTheme ? BDRCLogoLight : BDRCLogo,
      cbeta: CBETALogo,
      dsbc: DSBCLogo,
      gretil: isDarkTheme ? GRETILLogoLight : GRETILLogo,
      rkts: isDarkTheme ? RKTSLogoLight : RKTSLogo,
      suttacentral: SCLogo,
      vri: VRILogo,
    };
  }, [isDarkTheme]);

  if (data && Object.keys(data).length > 0) {
    return (
      <>
        <PanelHeading heading={t("headings.links")} sx={{ mt: 1 }} />

        <List
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(data).map(([key, value]) =>
            !value || value === "False" ? null : (
              <ListItem key={key} sx={{ width: "inherit", pr: 0 }}>
                <SourceLink
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={key}
                >
                  {key === "cbc" ? (
                    <CBCIcon fill={materialTheme.palette.text.primary} />
                  ) : (
                    <Image src={logos[key]!} alt={`${key} logo`} height={32} />
                  )}
                </SourceLink>
              </ListItem>
            ),
          )}
        </List>
      </>
    );
  }
  return null;
};
