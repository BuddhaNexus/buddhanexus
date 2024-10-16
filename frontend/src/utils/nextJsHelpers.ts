import type { GetStaticPaths } from "next";
import type { UserConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  SOURCE_LANGUAGES,
  // SourceLanguage,
  SUPPORTED_LOCALES,
} from "./constants";

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
  extraNamespaces?: string[],
) => Promise<I18nProps> = async (
  { locale }: Locale,
  extraNamespaces: string[] = [],
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
  Object.keys(SUPPORTED_LOCALES).map((locale) => ({
    params: { language },
    locale,
  })),
);

export const getSourceLanguageStaticPaths: GetStaticPaths = () => ({
  paths: sourceLanguagePaths,
  fallback: false,
});

// export const getDbViewFileStaticPaths: GetStaticPaths = async () => {
//   const pliMenuData = await getTextFileMenuData({
//     language: SourceLanguage.PALI,
//   });
//   const paliFilenames = pliMenuData.map((menuData) => menuData.fileName);
//   const chineseMenuData = await getTextFileMenuData({
//     language: SourceLanguage.CHINESE,
//   });
//   const chineseFilenames = chineseMenuData.map((menuData) => menuData.fileName);
//   const sanskritMenuData = await getTextFileMenuData({
//     language: SourceLanguage.SANSKRIT,
//   });
//   const sanskritFilenames = sanskritMenuData.map(
//     (menuData) => menuData.fileName,
//   );
//   const tibetanMenuData = await getTextFileMenuData({
//     language: SourceLanguage.TIBETAN,
//   });
//   const tibetanFilenames = tibetanMenuData.map((menuData) => menuData.fileName);

//   const allFilenames = [
//     { language: SourceLanguage.TIBETAN, filenames: tibetanFilenames },
//     { language: SourceLanguage.CHINESE, filenames: chineseFilenames },
//     { language: SourceLanguage.SANSKRIT, filenames: sanskritFilenames },
//     { language: SourceLanguage.PALI, filenames: paliFilenames },
//   ];

//   /**
//    * Returns object like:
//    * [
//    *   { params: { language: 'pli', file: 'dn1' }, locale: 'en' },
//    *   { params: { language: 'pli', file: 'dn1' }, locale: 'de' },
//    *   { params: { language: 'pli', file: 'dn2' }, locale: 'en' },
//    *   ...
//    * ]
//    */
//   return {
//     paths: allFilenames.flatMap(({ language, filenames }) =>
//       filenames.flatMap((file) =>
//         Object.keys(SUPPORTED_LOCALES).map((locale) => ({
//           params: { language, file },
//           locale,
//         })),
//       ),
//     ),
//     fallback: true,
//   };
// };
