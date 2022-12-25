import type { DatabaseText } from "@components/db/types";
import type { ApiLanguageMenuData } from "types/api";
import type { SourceLanguage } from "utils/constants";

const API_ROOT_URL = process.env.NEXT_PUBLIC_API_URL;

// source language menu on main db page (Autocomplete component)
async function getLanguageMenuData(
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

// graph view
async function getGraphData(fileName: string) {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/graph?co_occ=2000`
  );
  return await res.json();
}

// source text collections
// TODO: use for the text browser tree view
// export async function getSourceTextCollections(language: SourceLanguage) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/menus/sidebar/${language}`
//   );
//   const response = await res.json();
//
//   return response.result.map((collection: SourceTextCollectionApiData) => ({
//     // label: menuItem.search_field,
//     // id: menuItem.search_field,
//     // name: menuItem.displayName,
//     // textName: menuItem.textname,
//     // category: menuItem.category,
//   }));
// }

export const DbApi = {
  LanguageMenu: {
    makeQueryKey: (language: SourceLanguage) => ["languageMenuData", language],
    call: getLanguageMenuData,
  },
  GraphPage: {
    makeQueryKey: (fileName: string) => ["graphData", fileName],
    call: getGraphData,
  },
  SidebarSourceTexts: {
    makeQueryKey: (language: SourceLanguage) => ["textCollections", language],
  },
};
