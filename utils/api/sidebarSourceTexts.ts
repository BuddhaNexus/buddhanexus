// source text collections
import type { SourceLanguage } from "utils/constants";

import { API_ROOT_URL } from "./constants";

export async function getSourceTextCollections(language: SourceLanguage) {
  const res = await fetch(`${API_ROOT_URL}/menus/sidebar/${language}`);
  const response = await res.json();

  console.log({ response });

  return response.result.map((collection: SourceTextCollectionApiData) => ({
    label: menuItem.search_field,
    id: menuItem.search_field,
    name: menuItem.displayName,
    textName: menuItem.textname,
    category: menuItem.category,
  }));
}
