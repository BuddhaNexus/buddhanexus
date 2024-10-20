import apiClient from "@api";
import { transformDataForTreeView } from "@components/db/SearchableDbSourceTree/utils";
import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";

function parseStructuredDbSourceMenuData(
  data: APIGetResponse<"/menu/menudata/">,
) {
  return data.menudata.map(({ collection, categories }) => ({
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
  query: APIGetRequestQuery<"/menu/menudata/">,
) {
  const { data } = await apiClient.GET("/menu/menudata/", {
    params: { query },
  });

  const parsedApiData = data ? parseStructuredDbSourceMenuData(data) : [];
  return transformDataForTreeView(parsedApiData);
}
