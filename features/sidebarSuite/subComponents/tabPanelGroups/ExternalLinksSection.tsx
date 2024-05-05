import React from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { List, ListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { SourceLink } from "features/sidebarSuite/common/MuiStyledSidebarComponents";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import BDRCLogo from "public/assets/icons/logo_bdrc.png";
import CBETALogo from "public/assets/icons/logo_cbeta.png";
import DSBCLogo from "public/assets/icons/logo_dsbc.png";
import GRETILLogo from "public/assets/icons/logo_gretil.png";
import RKTSLogo from "public/assets/icons/logo_rkts.png";
import SCLogo from "public/assets/icons/logo_sc.png";
import VRILogo from "public/assets/icons/logo_vri.png";
import { DbApi } from "utils/api/dbApi";

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

const logos: Record<string, StaticImageData> = {
  bdrc: BDRCLogo,
  cbeta: CBETALogo,
  dsbc: DSBCLogo,
  gretil: GRETILLogo,
  rkts: RKTSLogo,
  suttacentral: SCLogo,
  vri: VRILogo,
};

// TODO: confirm this is exclusively used in DB file selection results pages and does not need to be refactored to be applied universally
export const ExternalLinksSection = () => {
  const { fileName } = useDbQueryParams();
  const { t } = useTranslation("settings");
  const materialTheme = useTheme();

  const { data } = useQuery({
    queryKey: [DbApi.ExternalLinksData.makeQueryKey(fileName)],
    queryFn: () => DbApi.ExternalLinksData.call({ fileName }),
  });

  // TODO: sort out dark theme icons, http://localhost:3000/db/tib/K01D0003_H0003/table
  // const isDarkTheme = materialTheme.palette.mode === "dark"

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
          {Object.entries(data).map(
            ([key, value]) =>
              value && (
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
                      <Image
                        src={logos[key]!}
                        alt={`${key} logo`}
                        height={32}
                      />
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
