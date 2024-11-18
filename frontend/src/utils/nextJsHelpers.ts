import type { GetStaticPaths } from "next";
import type { UserConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { dbLanguages } from "@utils/api/constants";

// TODO: getTextFileMenuData function removed with api update dropping the relevant menu endpoints. This needs to be refactored for the "metadata" endpoint
import { SUPPORTED_LOCALES } from "./constants";

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

const dbLanguagePaths = dbLanguages.flatMap((language) =>
  Object.keys(SUPPORTED_LOCALES).map((locale) => ({
    params: { language },
    locale,
  })),
);

export const getDbLanguageStaticPaths: GetStaticPaths = () => ({
  paths: dbLanguagePaths,
  fallback: false,
});

// export const getDbViewFileStaticPaths: GetStaticPaths = async () => {
//   const pliMenuData = await getTextFileMenuData({
//     language: "pa",
//   });
//   const paliFilenames = pliMenuData.map((menuData) => menuData.fileName);
//   const chineseMenuData = await getTextFileMenuData({
//     language: "zh",
//   });
//   const chineseFilenames = chineseMenuData.map((menuData) => menuData.fileName);
//   const sanskritMenuData = await getTextFileMenuData({
//     language: "sa",
//   });
//   const sanskritFilenames = sanskritMenuData.map(
//     (menuData) => menuData.fileName,
//   );
//   const tibetanMenuData = await getTextFileMenuData({
//     language: "bo",
//   });
//   const tibetanFilenames = tibetanMenuData.map((menuData) => menuData.fileName);

//   const allFilenames = [
//     { language: "bo", filenames: tibetanFilenames },
//     { language: "zh", filenames: chineseFilenames },
//     { language: "sa", filenames: sanskritFilenames },
//     { language: "pa", filenames: paliFilenames },
//   ];

//   /**
//    * Returns object like:
//    * [
//    *   As part of getTextFileMenuData refactor consider if the
//    *   reutrned language value should be full name rather than
//    *   language code.
//    *
//    *   { params: { language: 'pa', file: 'dn1' }, locale: 'en' },
//    *   { params: { language: 'pa', file: 'dn1' }, locale: 'de' },
//    *   { params: { language: 'pa', file: 'dn2' }, locale: 'en' },
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
