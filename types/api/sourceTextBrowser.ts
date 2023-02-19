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

type NavigationMenuData = {
  collection: string;
  categories: {
    name: string;
    displayName: string;
    files: {
      availableLanguages: string | null;
      displayName: string;
      fileName: string;
      textName: string;
    }[];
  }[];
};

export type SourceTextBrowserData = NavigationMenuData[];
