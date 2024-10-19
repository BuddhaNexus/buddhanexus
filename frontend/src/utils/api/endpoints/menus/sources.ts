import apiClient from "@api";
import { transformDataForTreeView } from "@components/db/SearchableDbSourceTree/utils";
import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";

function parseStructuredDbSourceMenuData(
  data: APIGetResponse<"/menus/metadata/">,
) {
  return data.metadata.map(({ collection, categories }) => ({
    collection,
    categories: categories.map(
      ({ files, categorydisplayname, category: categoryName }) => ({
        files: files.map(({ displayName, filename, search_field }) => ({
          displayName,
          searchField: search_field,
          fileName: filename,
          category: categoryName,
        })),
        name: categoryName,
        displayName: categorydisplayname,
      }),
    ),
  }));
}

export type ParsedStructuredDbSourceMenuData = ReturnType<
  typeof parseStructuredDbSourceMenuData
>;

export async function getDbSourceMenuData(
  query: APIGetRequestQuery<"/menus/metadata/">,
) {
  const { data } = await apiClient.GET("/menus/metadata/", {
    params: { query },
  });

  const parsedApiData = data ? parseStructuredDbSourceMenuData(data) : [];
  return transformDataForTreeView(parsedApiData);
}
