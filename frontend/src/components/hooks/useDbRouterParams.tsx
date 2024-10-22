import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getDbLanguage, getValidDbLanguage } from "@utils/validators";

export const useDbRouterParams = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { file, language } = router.query;

  const dbLanguage = getValidDbLanguage(language);
  const fileName = Array.isArray(file) ? file.join("/") : `${file}`;

  return {
    dbLanguage,
    dbLanguageName: t(`language.${dbLanguage}`),
    fileName,
  };
};

export const useNullableDbRouterParams = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { file, language } = router.query;

  const fileName = Array.isArray(file) ? file.join("/") : `${file}`;

  const nullableDbLanguage = getDbLanguage(language);
  return {
    dbLanguage: nullableDbLanguage,
    dbLanguageName: t(`language.${nullableDbLanguage}`),
    fileName,
  };
};
