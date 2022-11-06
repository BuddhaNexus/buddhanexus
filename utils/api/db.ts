import type { ApiLanguageMenuData } from "types/api";
import type { SourceLanguage } from "utils/constants";

export const getLanguageMenuDataQueryKey = (language: SourceLanguage) => [
  "languageMenuData",
  language,
];

export async function getLanguageMenuData(language: SourceLanguage) {
  const res = await fetch(
    `https://buddhanexus2.kc-tbts.uni-hamburg.de/api/menus/${language}`
  );
  const response = await res.json();

  // TODO: Add pagination on BE
  return response.result.map((menuItem: ApiLanguageMenuData) => ({
    label: menuItem.search_field,
    id: menuItem.search_field,
    name: menuItem.displayName,
    textName: menuItem.textname,
    category: menuItem.category,
  }));
}
