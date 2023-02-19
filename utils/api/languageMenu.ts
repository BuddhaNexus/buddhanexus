// source language menu on main db page (Autocomplete component)
import type { DatabaseText } from "@components/db/types";
import type { ApiLanguageMenuData } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { API_ROOT_URL } from "./constants";

export async function getLanguageMenuData(
  language: SourceLanguage
): Promise<DatabaseText[]> {
  const res = await fetch(`${API_ROOT_URL}/menus/${language}`);
  const response = await res.json();

  // TODO: Add pagination on BE
  return response.result.map((menuItem: ApiLanguageMenuData) => ({
    label: menuItem.search_field,
    id: menuItem.search_field,
    name: menuItem.displayName,
    fileName: menuItem.filename,
    textName: menuItem.textname,
    category: menuItem.category,
  }));
}
