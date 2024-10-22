import type { Script } from "@features/SidebarSuite/types";
import { APISchemas, DbLanguage } from "@utils/api/types";
import { EwtsConverter } from "tibetan-ewts-converter";

type LanguageUnavailableSettings<T extends string> = Partial<
  Record<T, APISchemas["Languages"][]>
>;

export const getAvailableSettings = <T extends string>({
  unavailableSettingsForViewOrLang,
  uiSettings,
  dbLanguage,
}: {
  unavailableSettingsForViewOrLang: LanguageUnavailableSettings<T>;
  uiSettings: T[];
  dbLanguage: DbLanguage;
}) => {
  const availableSettings: T[] = [];

  for (const settingName of uiSettings) {
    if (!unavailableSettingsForViewOrLang[settingName]) {
      availableSettings.push(settingName);
      continue;
    }

    if (unavailableSettingsForViewOrLang[settingName]?.includes("all")) {
      continue;
    }

    if (!unavailableSettingsForViewOrLang[settingName]?.includes(dbLanguage)) {
      availableSettings.push(settingName);
    }
  }

  return availableSettings;
};

const ewts = new EwtsConverter();

export const enscriptText = ({
  text,
  language,
  script,
}: {
  text?: string;
  language: DbLanguage | undefined;
  script: Script;
}) => {
  return script === "Unicode" && language === "bo"
    ? ewts.to_unicode(text)
    : text;
};
