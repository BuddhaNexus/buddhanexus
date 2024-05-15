import apiClient from "@api";
import { transformDataForTreeView } from "@components/treeView/utils";
import type {
  ApiSourceTextBrowserData,
  SourceTextBrowserData,
} from "utils/api/types/menus";
import type { SourceLanguage } from "utils/constants";

function parseSourceTextCollectionData(
  data: ApiSourceTextBrowserData,
): SourceTextBrowserData {
  return data.navigationmenudata.map(({ collection, categories }) => ({
    collection,
    categories: categories.map(
      ({ files, categorydisplayname, categoryname }) => ({
        files: files.map(
          ({ textname, file_name, available_lang, displayname }) => ({
            textName: textname,
            displayName: displayname,
            fileName: file_name,
            availableLanguages: available_lang! as SourceLanguage[],
          }),
        ),
        name: categoryname,
        displayName: categorydisplayname,
      }),
    ),
  }));
}

export async function getSourceTextCollections(language: SourceLanguage) {
  const { data } = await apiClient.GET("/menus/sidebar/", {
    params: { query: { language } },
  });

  // TODO: - remove type casting once response model is added to api
  const parsedApiData = parseSourceTextCollectionData(
    data as ApiSourceTextBrowserData,
  );
  return transformDataForTreeView(parsedApiData);
}
