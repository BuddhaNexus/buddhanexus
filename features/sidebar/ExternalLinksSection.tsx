import React from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { List, ListItem, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import BDRCLogo from "public/assets/icons/logo_bdrc.png";
import CBETALogo from "public/assets/icons/logo_cbeta.png";
import DSBCLogo from "public/assets/icons/logo_dsbc.png";
import GRETILLogo from "public/assets/icons/logo_gretil.png";
import RKTSLogo from "public/assets/icons/logo_rkts.png";
import SCLogo from "public/assets/icons/logo_sc.png";
import VRILogo from "public/assets/icons/logo_vri.png";
import { DbApi } from "utils/api/dbApi";

import { SourceLink } from "./MuiStyledSidebarComponents";

function CBCIcon() {
  return (
    <div
      style={{
        backgroundColor: "#333333",
        borderRadius: "4px",
        overflow: "hidden",
        display: "inline-block",
        width: "48px",
        height: "32px",
      }}
    >
      <svg viewBox="0 0 48 32">
        <text
          x="24"
          y="16"
          fontSize="16"
          fill="white"
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

export const ExternalLinksSection = () => {
  const { fileName } = useDbQueryParams();
  const { t } = useTranslation("settings");

  const { data } = useQuery({
    queryKey: [DbApi.ExternalLinksData.makeQueryKey(fileName)],
    queryFn: () => DbApi.ExternalLinksData.call(fileName),
    refetchOnWindowFocus: false,
  });

  if (data && Object.keys(data).length > 0) {
    return (
      <>
        <Typography variant="h6" component="h3" mx={2} mt={1}>
          {t("headings.links")}
        </Typography>

        <List sx={{ display: "flex", justifyContent: "flex-start" }}>
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
                      <CBCIcon />
                    ) : (
                      <Image src={logos[key]} alt={`${key} logo`} height={32} />
                    )}
                  </SourceLink>
                </ListItem>
              )
          )}
        </List>
      </>
    );
  }
  return null;
};
