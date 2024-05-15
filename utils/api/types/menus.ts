import type { SourceLanguage } from "utils/constants";

export interface ApiSourceTextBrowserData {
  navigationmenudata: {
    collection: string;
    categories: {
      categoryname: string;
      categorydisplayname: string;
      files: {
        available_lang?: string[];
        displayname: string;
        file_name: string;
        textname: string;
      }[];
    }[];
  }[];
}

export type NavigationMenuFileData = {
  availableLanguages: SourceLanguage[] | null;
  displayName: string;
  fileName: string;
  textName: string;
};

export type NavigationMenuCategoryData = {
  name: string;
  displayName: string;
  files: NavigationMenuFileData[];
};

export type NavigationMenuData = {
  collection: string;
  categories: NavigationMenuCategoryData[];
};

export type SourceTextBrowserData = NavigationMenuData[];

export type SourceTextBrowserDataTypes = NavigationMenuCategoryData &
  NavigationMenuData &
  NavigationMenuFileData;

export interface ApiLanguageMenuData {
  // Text list menu for source language
  displayName: string;
  search_field: string;
  textname: string;
  filename: string;
  category: string;
  available_lang: null;
}

export interface DatabaseText {
  id: string;
  name: string;
  fileName: string;
  textName: string;
  category: string;
  label: string;
}

export interface CategoryMenuItem {
  id: string;
  name: string;
  label: string;
}
