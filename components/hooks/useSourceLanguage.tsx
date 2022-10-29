import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export const useSourceLanguage = () => {
  const {
    query: { language },
  } = useRouter();

  const { t } = useTranslation();
  // @ts-expect-error i18n types are not that smart!
  const languageName = t(`language.${language}`) as string;

  return { language, languageName };
};
