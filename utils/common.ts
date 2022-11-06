import type { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { SourceLanguage } from "./constants";

export const getI18NextStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

export const getSourceLanguageStaticPaths: GetStaticPaths = () => ({
  paths: [
    { params: { language: SourceLanguage.PALI } },
    { params: { language: SourceLanguage.SANSKRIT } },
    { params: { language: SourceLanguage.CHINESE } },
    { params: { language: SourceLanguage.TIBETAN } },
  ],
  fallback: false,
});
