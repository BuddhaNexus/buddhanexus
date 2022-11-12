import type { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ALL_LOCALES, SOURCE_LANGUAGES } from "./constants";

export const getI18NextStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

const sourceLanguagePaths = SOURCE_LANGUAGES.flatMap((language) =>
  ALL_LOCALES.map((locale) => ({ params: { language }, locale }))
);

export const getSourceLanguageStaticPaths: GetStaticPaths = () => ({
  paths: sourceLanguagePaths,
  fallback: false,
});
