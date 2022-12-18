import type {
  ApiLanguageMenuData,
  // SourceTextCollectionApiData,
} from "types/api";
import type { SourceLanguage } from "utils/constants";

const API_ROOT_URL = process.env.NEXT_PUBLIC_API_URL;

// source language menu (all the texts)

export const getLanguageMenuDataQueryKey = (language: SourceLanguage) => [
  "languageMenuData",
  language,
];

export async function getLanguageMenuData(language: SourceLanguage) {
  const res = await fetch(`${API_ROOT_URL}/menus/${language}`);
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

// graph view

export const getGraphDataQueryKey = (fileName: string) => [
  "graphData",
  fileName,
];

export async function getGraphData(fileName: string) {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/graph?co_occ=2000`
  );
  const response = await res.json();

  // console.log(response);
  return response;
}

// source text collections

export const getSourceTextCollectionsQueryKey = (language: SourceLanguage) => [
  "textCollections",
  language,
];

// TODO: use for the text brower tree view
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
