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
      { params: { language: SourceLanguage.PALI } },
      { params: { language: SourceLanguage.SANSKRIT } },
      { params: { language: SourceLanguage.CHINESE } },
      { params: { language: SourceLanguage.TIBETAN } },
    ],
    fallback: false,
  };
}
