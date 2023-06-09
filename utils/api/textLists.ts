// source language menu on main db page (Autocomplete component)
import type { SourceLanguage } from "utils/constants";

import { API_ROOT_URL } from "./constants";

export interface ApiLanguageMenuData {
  // Text list menu for source language
  displayName: string;
  search_field: string;
  textname: string;
  filename: string;
  category: string;
  available_lang: null;
}

// Legacy: to be replace with TextMenuItem on agreement
export interface DatabaseText {
  label: string;
  id: string;
  name: string;
  fileName: string;
  textName: string;
  category: string;
}

export interface TextMenuItem {
  id: string;
  ref: string;
  name: string;
  category: string;
  searchString: string;
}

export interface CategoryMenuItem {
  id: string;
  name: string;
}

export async function getTextMenuItems(
  language: SourceLanguage
): Promise<Map<string, TextMenuItem>> {
  const res = await fetch(`${API_ROOT_URL}/menus/files/?language=${language}`);
  const response = await res.json();
  // TODO: Add pagination on BE
  return response.results.reduce(
    (map: Map<string, TextMenuItem>, text: ApiLanguageMenuData) => {
      const { displayName, search_field, textname, filename, category } = text;
      map.set(filename, {
        id: filename,
        ref: textname,
        name: displayName,
        category,
        searchString: search_field,
      });
      return map;
    },
    new Map()
  );
}

export async function getCategoryMenuItems(
  language: SourceLanguage
): Promise<Map<string, CategoryMenuItem>> {
  const res = await fetch(
    `${API_ROOT_URL}/menus/category/?language=${language}`
  );
  const response = await res.json();

  return response.categoryitems
    .flat()
    .reduce(
      (
        map: Map<string, CategoryMenuItem>,
        cat: { category: string; categoryname: string }
      ) => {
        const { category, categoryname } = cat;
        map.set(category, { id: category, name: categoryname });
        return map;
      },
      new Map()
    );
}

/* 
  ApiLanguageMenuData response:
 {
   displayName: 'Cūḷadhammasamādāna Sutta',
   search_field: 'Mn 45 Cūḷadhammasamādāna Sutta (Culadhammasamadana Sutta)',
   textname: 'Mn 45',
   filename: 'mn45',
   category: 'mn',
   available_lang: null
 }

 Text return
 {
  id: 'mn45';
  ref: 'MN 45';
  name: 'Cūḷadhammasamādāna Sutta';
  category: 'mn';
  searchString: Mn 45 Cūḷadhammasamādāna Sutta (Culadhammasamadana Sutta)';
 }
  
  ApiLanguageMenuData response:
  {
    "category": string;
    "categoryname": string;
  } 
*/
