import React from "react";
import { Trans, useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { Typography } from "@mui/material";
import type { SourceLanguage } from "utils/constants";

const ChineseDescription = () => {
  const { t } = useTranslation("db");

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="chn.p01"
          t={t}
          components={[
            <Link
              key="chn-p01-link"
              href="https://www.cbeta.org/"
              target="_blank"
              rel="noopener"
            />,
          ]}
        />
      </Typography>

      <Typography>{t("chn.p02")}</Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("chn.p03")}
      </Typography>
    </>
  );
};

const PaliDescription = () => {
  const { t } = useTranslation("db");

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="pli.p01"
          t={t}
          components={[
            <Link
              key="pli-p01-link"
              href="https://tipitaka.org/"
              target="_blank"
              rel="noopener"
            />,
          ]}
        />
      </Typography>

      <Typography>
        <Trans
          i18nKey="pli.p02"
          t={t}
          components={[
            <Link
              key="pli-p02-link-01"
              href="https://github.com/suttacentral/bilara-data"
              target="_blank"
              rel="noopener"
            />,
            <Link
              key="pli-p02-link-02"
              href="https://suttacentral.net/"
              target="_blank"
              rel="noopener"
            />,
          ]}
        />
      </Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("pli.p03")}
      </Typography>

      <Typography>{t("pli.p04")}</Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("pli.p05")}
      </Typography>
    </>
  );
};

const SanskritDescription = () => {
  const { t } = useTranslation("db");

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="skt.p01"
          t={t}
          components={[
            <Link
              key="skt-p01-link-01"
              href="http://gretil.sub.uni-goettingen.de/gretil.html"
              target="_blank"
              rel="noopener"
            />,
            <Link
              key="skt-p01-link-02"
              href="https://www.dsbcproject.org/"
              target="_blank"
              rel="noopener"
            />,
            <Link
              key="skt-p01-link-03"
              href="https://www.suttacentral.net/"
              target="_blank"
              rel="noopener"
            />,
          ]}
        />
      </Typography>

      <Typography>{t("skt.p02")}</Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("skt.p03")}
      </Typography>

      <Typography>
        <Trans
          i18nKey="skt.p04"
          t={t}
          components={[
            <Link
              key="skt-p04-link"
              href="https://buddhanexus.net/sanskrit-tools"
              target="_blank"
              rel="noopener"
            />,
          ]}
        />
      </Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("skt.p05")}
      </Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("skt.p06")}
      </Typography>
    </>
  );
};

const TibetanDescription = () => {
  const { t } = useTranslation("db");

  return (
    <>
      <Typography variant="body1" sx={{ my: 2 }}>
        <Trans
          i18nKey="tib.p01"
          t={t}
          components={[
            <Link
              key="tib-p01-link-01"
              href="https://asianclassics.org/"
              target="_blank"
              rel="noopener"
            />,
            <Link
              key="tib-p01-link-02"
              href="https://www.tbrc.org/"
              target="_blank"
              rel="noopener"
            />,
          ]}
        />
      </Typography>

      <Typography>{t("tib.p02")}</Typography>

      <Typography variant="body1" sx={{ my: 2 }}>
        {t("tib.p03")}
      </Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        {t("tib.p04")}
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
