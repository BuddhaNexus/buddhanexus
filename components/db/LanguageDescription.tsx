import React from "react";
import { Trans, useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { Typography } from "@mui/material";
import type { SourceLanguage } from "utils/constants";

const ChineseDescription = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="dbChn:p01"
          t={t}
          components={[<Link key="0" href="https://www.cbeta.org/" />]}
        />
      </Typography>

      <Typography>{t("dbChn:p02")}</Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("dbChn:p03")}
      </Typography>
    </>
  );
};

const PaliDescription = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="dbPli:p01"
          t={t}
          components={[<Link key="0" href="https://tipitaka.org/" />]}
        />
      </Typography>

      <Typography>
        <Trans
          i18nKey="dbPli:p02"
          t={t}
          components={[
            <Link key="0" href="https://github.com/suttacentral/bilara-data" />,
            <Link key="1" href="https://suttacentral.net/" />,
          ]}
        />
      </Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("dbPli:p03")}
      </Typography>

      <Typography>{t("dbPli:p04")}</Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("dbPli:p05")}
      </Typography>
    </>
  );
};

const SanskritDescription = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="dbSkt:p01"
          t={t}
          components={[
            <Link
              key="0"
              href="http://gretil.sub.uni-goettingen.de/gretil.html"
            />,
            <Link key="1" href="https://www.dsbcproject.org/" />,
            <Link key="2" href="https://www.suttacentral.net/" />,
          ]}
        />
      </Typography>

      <Typography>{t("dbSkt:p02")}</Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("dbSkt:p03")}
      </Typography>

      <Typography>
        <Trans
          i18nKey="dbSkt:p04"
          t={t}
          components={[
            <Link key="0" href="https://buddhanexus.net/sanskrit-tools" />,
          ]}
        />
      </Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("dbSkt:p05")}
      </Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("dbSkt:p06")}
      </Typography>
    </>
  );
};

const TibetanDescription = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="dbTib:p01"
          t={t}
          components={[
            <Link key="0" href="https://asianclassics.org/" />,
            <Link key="1" href="https://www.tbrc.org/" />,
          ]}
        />
      </Typography>

      <Typography>{t("dbTib:p02")}</Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("dbTib:p03")}
      </Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("dbTib:p04")}
      </Typography>
    </>
  );
};

export const LanguageDescription = ({ lang }: { lang: SourceLanguage }) => {
  const LanguageDescriptions = {
    chn: <ChineseDescription />,
    pli: <PaliDescription />,
    skt: <SanskritDescription />,
    tib: <TibetanDescription />,
  };

  return LanguageDescriptions[lang];
};
