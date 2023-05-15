import React from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { List, ListItem, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import BDRCLogo from "public/assets/icons/logo_bdrc.png";
import CBETALogo from "public/assets/icons/logo_cbeta.png";
import DSBCLogo from "public/assets/icons/logo_dsbc.png";
import GRETILLogo from "public/assets/icons/logo_gretil.png";
import RKTSLogo from "public/assets/icons/logo_rkts.png";
import SCLogo from "public/assets/icons/logo_sc.png";
import VRILogo from "public/assets/icons/logo_vri.png";
import { DbApi } from "utils/api/dbApi";

import { SourceLink } from "./common/MuiStyledSidebarComponents";

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

export const ExternalLinksSection = () => {
  const { fileName } = useDbQueryParams();
  const { t } = useTranslation("settings");
  const theme = useTheme();

  const { data } = useQuery({
    queryKey: [DbApi.ExternalLinksData.makeQueryKey(fileName)],
    queryFn: () => DbApi.ExternalLinksData.call(fileName),
    refetchOnWindowFocus: false,
  });

  // TODO: sort out dark theme icons, http://localhost:3000/db/tib/K01D0003_H0003/table

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
                      <CBCIcon fill={theme.palette.text.primary} />
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
