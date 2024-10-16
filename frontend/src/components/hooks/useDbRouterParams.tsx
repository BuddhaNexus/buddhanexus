import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { getValidDbLanguage } from "@utils/validators";

export const useDbRouterParams = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { file, language } = router.query;
  const sourceLanguage = getValidDbLanguage(language);
  const fileName = file as string;

  return {
    sourceLanguage,
    sourceLanguageName: t(`language.${sourceLanguage}`),
    fileName,
  };
};
