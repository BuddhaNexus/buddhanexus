import React from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Link, List, ListItem, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import BDRCLogo from "public/assets/icons/logo_bdrc.png";
import CBETALogo from "public/assets/icons/logo_cbeta.png";
import DSBCLogo from "public/assets/icons/logo_dsbc.png";
import GRETILLogo from "public/assets/icons/logo_gretil.png";
import RKTSLogo from "public/assets/icons/logo_rkts.png";
import SCLogo from "public/assets/icons/logo_sc.png";
import VRILogo from "public/assets/icons/logo_vri.png";
import { DbApi } from "utils/api/dbApi";

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

  const listItems = React.Children.toArray(
    <>
      {data
        ? Object.entries(data).map(([key, value]) => {
            if (key === "cbc") {
              // TODO: at time of writing, https://dazangthings.nz/cbc/ was broken. Confirm if site has been taken down, or it was a temporary issue.
              return null;
            }
            return (
              value && (
                <ListItem sx={{ width: "inherit", pr: 0 }}>
                  <Link href={value} target="_blank" rel="noopener noreferrer">
                    <Image src={logos[key]} alt={`${key} logo`} height={32} />
                  </Link>
                </ListItem>
              )
            );
          })
        : null}
    </>
  );

  return data && Object.keys(data).length > 0 ? (
    <>
      <Typography variant="h6" component="h3" mx={2} mt={1}>
        {t("headings.links")}
      </Typography>
      <List sx={{ display: "flex", justifyContent: "flex-start" }}>
        {listItems}
      </List>
    </>
  ) : null;
};
