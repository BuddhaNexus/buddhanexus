export interface ApiSourceTextBrowserData {
  navigationmenudata: {
    collection: string;
    categories: {
      categoryname: string;
      categorydisplayname: string;
      files: {
        available_lang: string | null;
        displayname: string;
        filename: string;
        textname: string;
      }[];
    }[];
  }[];
}

export type NavigationMenuFileData = {
  availableLanguages: string | null;
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
