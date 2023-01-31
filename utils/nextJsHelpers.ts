import type { GetStaticPaths } from "next";
import type { UserConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ALL_LOCALES, SOURCE_LANGUAGES } from "./constants";

interface I18nProps {
  props: {
    _nextI18Next?: {
      initialI18nStore: any;
      initialLocale: string;
      ns: string[];
      userConfig: UserConfig | null;
    };
  };
}

type Locale = { locale: string | undefined };

export const getI18NextStaticProps: (
  { locale }: Locale,
  extraNamespaces?: string[]
) => Promise<I18nProps> = async (
  { locale }: Locale,
  extraNamespaces: string[] = []
) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "common",
        ...extraNamespaces,
      ])),
    },
  };
};

const sourceLanguagePaths = SOURCE_LANGUAGES.flatMap((language) =>
  ALL_LOCALES.map((locale) => ({ params: { language }, locale }))
);

export const getSourceLanguageStaticPaths: GetStaticPaths = () => ({
  paths: sourceLanguagePaths,
  fallback: false,
});

const sourceTextPaths = SOURCE_LANGUAGES.flatMap((language) =>
  ALL_LOCALES.map((locale) => ({ params: { language, file: "file" }, locale }))
);

// todo:
// 1. Get all file names for language
// List them here
export const getSourceTextStaticPaths: GetStaticPaths = () => ({
  paths: sourceTextPaths,
  fallback: true,
});
