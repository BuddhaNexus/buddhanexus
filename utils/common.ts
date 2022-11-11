import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { SourceLanguage } from "./constants";

export async function getI18NextStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export function getSourceLanguageStaticPaths() {
  return {
    paths: [
      { params: { language: SourceLanguage.PALI }, locale: "en" },
      { params: { language: SourceLanguage.PALI }, locale: "de" },
      { params: { language: SourceLanguage.SANSKRIT }, locale: "en" },
      { params: { language: SourceLanguage.SANSKRIT }, locale: "de" },
      { params: { language: SourceLanguage.CHINESE }, locale: "en" },
      { params: { language: SourceLanguage.CHINESE }, locale: "de" },
      { params: { language: SourceLanguage.TIBETAN }, locale: "en" },
      { params: { language: SourceLanguage.TIBETAN }, locale: "de" },
    ],
    fallback: false,
  };
}
