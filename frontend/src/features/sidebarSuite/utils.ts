import { SourceLanguage as Lang } from "@utils/constants";

export type UnavailableLanguages = Lang[] | "allLangs";

type LanguageUnavailableSettings<T extends string> = Partial<
  Record<T, UnavailableLanguages>
>;

export const getAvailableSettings = <T extends string>({
  unavailableSettingsForView,
  uiSettings,
  sourceLanguage,
}: {
  unavailableSettingsForView: LanguageUnavailableSettings<T>;
  uiSettings: T[];
  sourceLanguage: Lang;
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

    if (!unavailableSettingsForView[settingName].includes(sourceLanguage)) {
      availableSettings.push(settingName);
    }
  }

  return availableSettings;
};
