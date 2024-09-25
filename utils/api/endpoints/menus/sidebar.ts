import apiClient from "@api";
import { transformDataForTreeView } from "@components/db/SourceTextTree/utils";
import type {
  APIMenuSidebarRequestQuery,
  APIMenuSidebarResponseData,
} from "utils/api/types";
import type { SourceLanguage } from "utils/constants";

function parseStructuredSourceTextMenuData(data: APIMenuSidebarResponseData) {
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

export type ParsedStructuredSourceTextMenuData = ReturnType<
  typeof parseStructuredSourceTextMenuData
>;

export async function getSidebarTextCollectionsMenuData(
  query: APIMenuSidebarRequestQuery,
) {
  const { data } = await apiClient.GET("/menus/sidebar/", {
    params: { query },
  });

  const parsedApiData = data ? parseStructuredSourceTextMenuData(data) : [];
  return transformDataForTreeView(parsedApiData);
}
