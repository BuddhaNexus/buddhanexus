import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import type { SourceLanguage } from "utils/constants";

export const useDbQueryParams = () => {
  const { query } = useRouter();
  const { t } = useTranslation();

  const sourceLanguage = query.language as SourceLanguage;
  const sourceLanguageName = t(`language.${sourceLanguage}`);

  const fileName = query.file as string;

  return { sourceLanguage, sourceLanguageName, fileName };
};
