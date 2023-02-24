import React from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Link, List, ListItem, Typography } from "@mui/material";
import BDRCLogo from "public/assets/icons/logo_bdrc.png";
import CBETALogo from "public/assets/icons/logo_cbeta.png";
import DSBCLogo from "public/assets/icons/logo_dsbc.png";
import GRETILLogo from "public/assets/icons/logo_gretil.png";
import RKTSLogo from "public/assets/icons/logo_rkts.png";
import SCLogo from "public/assets/icons/logo_sc.png";
import VRILogo from "public/assets/icons/logo_vri.png";
import { TEMP_EXTERNAL_TEXT_LINKS } from "utils/dbUISettings";

const linkSrcs: Record<string, StaticImageData> = {
  BDRC: BDRCLogo,
  CBETA: CBETALogo,
  DSBC: DSBCLogo,
  GRETIL: GRETILLogo,
  RKTS: RKTSLogo,
  SC: SCLogo,
  VRI: VRILogo,
};

export const ExternalTextLinks = () => {
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");

  // TODO: clarify external link sources & applications
  const listItems = React.Children.toArray(
    TEMP_EXTERNAL_TEXT_LINKS[sourceLanguage].map((src) => {
      return (
        <ListItem sx={{ width: "inherit", pr: 0 }}>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Image
              src={linkSrcs[src]}
              alt={`${src} logo`}
              height={32}
              placeholder="blur"
            />
          </Link>
        </ListItem>
      );
    })
  );

  return listItems.length > 0 ? (
    <>
      <Typography variant="h6" mx={2}>
        {t("headings.links")}
      </Typography>
      <List sx={{ display: "flex", justifyContent: "flex-start" }}>
        {listItems}
      </List>
    </>
  ) : null;
};
