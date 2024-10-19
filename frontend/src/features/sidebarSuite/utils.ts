import { DbLanguage } from "@utils/api/types";

export type UnavailableLanguages = DbLanguage[] | "allLangs";

type LanguageUnavailableSettings<T extends string> = Partial<
  Record<T, UnavailableLanguages>
>;

export const getAvailableSettings = <T extends string>({
  unavailableSettingsForView,
  uiSettings,
  dbLanguage,
}: {
  unavailableSettingsForView: LanguageUnavailableSettings<T>;
  uiSettings: T[];
  dbLanguage: DbLanguage;
}) => {
  const availableSettings: T[] = [];

  for (const settingName of uiSettings) {
    if (!unavailableSettingsForView[settingName]) {
      availableSettings.push(settingName);
      continue;
    }

    if (typeof unavailableSettingsForView[settingName].length === "string") {
      continue;
    }

    if (!unavailableSettingsForView[settingName].includes(dbLanguage)) {
      availableSettings.push(settingName);
    }
  }

  return availableSettings;
};
