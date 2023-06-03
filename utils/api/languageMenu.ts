// source language menu on main db page (Autocomplete component)
import type { SourceLanguage } from "utils/constants";

import { API_ROOT_URL } from "./constants";
import type { ApiLanguageMenuData, DatabaseText } from "./textLists";

export async function getLanguageMenuData(
  language: SourceLanguage
): Promise<DatabaseText[]> {
  const res = await fetch(`${API_ROOT_URL}/menus/files/?language=${language}`);
  const response = await res.json();

  // TODO: Add pagination on BE
  return response.results.map((menuItem: ApiLanguageMenuData) => ({
    label: menuItem.search_field,
    id: menuItem.filename,
    name: menuItem.displayName,
    fileName: menuItem.filename,
    textName: menuItem.textname,
    category: menuItem.category,
  }));
}
