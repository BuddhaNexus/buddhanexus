import apiClient from "@api";
import { transformDataForTreeView } from "@components/treeView/utils";
import type {
  APIMenuSidebarRequestQuery,
  APIMenuSidebarResponseData,
} from "@utils/api/types";
import type { SourceLanguage } from "@utils/constants";

function parseSidebarTextCollectionsMenuData(data: APIMenuSidebarResponseData) {
  return data.navigationmenudata.map(({ collection, categories }) => ({
    collection,
    categories: categories.map(
      ({ files, categorydisplayname, categoryname }) => ({
        files: files.map(
          ({ textname, file_name, available_lang, displayname }) => ({
            textName: textname,
            displayName: displayname,
            fileName: file_name,
            availableLanguages: [available_lang] as SourceLanguage[],
          }),
        ),
        name: categoryname,
        displayName: categorydisplayname,
      }),
    ),
  }));
}

export type ParsedSidebarTextCollectionsMenuData = ReturnType<
  typeof parseSidebarTextCollectionsMenuData
>;

export async function getSidebarTextCollectionsMenuData(
  query: APIMenuSidebarRequestQuery,
) {
  const { data } = await apiClient.GET("/menus/sidebar/", {
    params: { query },
  });

  const parsedApiData = data ? parseSidebarTextCollectionsMenuData(data) : [];
  return transformDataForTreeView(parsedApiData);
}
