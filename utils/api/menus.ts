import type { SourceLanguage } from "utils/constants";
import { transformDataForTreeView } from "@components/treeView/utils";
import apiClient from "@api";

import type {
  ApiSourceTextBrowserData,
  SourceTextBrowserData,
  ApiLanguageMenuData,
  DatabaseText,
  CategoryMenuItem,
} from "types/api/menus";

function parseSourceTextCollectionData(
  data: ApiSourceTextBrowserData
): SourceTextBrowserData {
  return data.navigationmenudata.map(({ collection, categories }) => ({
    collection,
    categories: categories.map(
      ({ files, categorydisplayname, categoryname }) => ({
        files: files.map(
          ({ textname, filename, available_lang, displayname }) => ({
            textName: textname,
            displayName: displayname,
            fileName: filename,
            availableLanguages: available_lang,
          })
        ),
        name: categoryname,
        displayName: categorydisplayname,
      })
    ),
  }));
}

export async function getSourceTextCollections(language: SourceLanguage) {
  const { data } = await apiClient.GET("/menus/sidebar/", {
    params: { query: { language } },
  });

  // TODO: - remove type casting once response model is added to api
  const parsedApiData = parseSourceTextCollectionData(
    data as ApiSourceTextBrowserData
  );
  return transformDataForTreeView(parsedApiData);
}

export async function getSourceTextMenuData(
  language: SourceLanguage
): Promise<DatabaseText[]> {
  const { data } = await apiClient.GET("/menus/files/", {
    params: { query: { language } },
  });

  // TODO: Add pagination on BE
  //  - remove type casting once response model is added to api
  //  - review parsed prop nams.
  const srcTextData = data as { results: ApiLanguageMenuData[] };
  return (
    srcTextData?.results?.map((text: ApiLanguageMenuData) => {
      const { displayName, search_field, textname, filename, category } = text;
      return {
        id: filename,
        name: displayName,
        label: displayName,
        fileName: filename,
        textName: textname,
        category,
        searchMatter: search_field,
      };
    }) ?? []
  );
}

export async function getCategoryMenuData(
  language: SourceLanguage
): Promise<Map<string, CategoryMenuItem>> {
  const { data } = await apiClient.GET("/menus/category/", {
    params: { query: { language } },
  });

  const categoryData = data as { categoryitems: any[] };

  return categoryData.categoryitems
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
