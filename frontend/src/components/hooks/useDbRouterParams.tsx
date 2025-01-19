import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getDbLanguage, getValidDbLanguage } from "@utils/validators";

export const useDbRouterParams = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { file, language } = router.query;

  const dbLanguage = getValidDbLanguage(language);
  let fileName = Array.isArray(file) ? file.join("/") : file;

  if (!fileName) {
    // TODO: proper error handling
    fileName = "";
  }

  return {
    dbLanguage,
    dbLanguageName: t(`language.${dbLanguage}`),
    fileName,
    isFallback: router.isFallback,
  };
};

export const useNullableDbRouterParams = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { file, language } = router.query;

  const fileName = Array.isArray(file) ? file.join("/") : file;

  const nullableDbLanguage = getDbLanguage(language);
  return {
    dbLanguage: nullableDbLanguage,
    dbLanguageName: t(`language.${nullableDbLanguage}`),
    fileName,
  };
};
