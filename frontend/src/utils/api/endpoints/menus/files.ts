import apiClient from "@api";
import type {
  APIMenuFilesRequestQuery,
  APIMenuFilesResponseData,
} from "@utils/api/types";

const parseTextFileMenuData = (data: APIMenuFilesResponseData) => {
  return data.results?.map((text) => {
    const { displayName, search_field, textname, filename, category } = text;
    return {
      id: filename,
      name: displayName,
      label: search_field,
      fileName: filename,
      textName: textname,
      category,
    };
  });
};

export type ParsedTextFileMenuItem = ReturnType<
  typeof parseTextFileMenuData
>[number];
export type ParsedTextFileMenuData = ParsedTextFileMenuItem[];

export async function getTextFileMenuData(query: APIMenuFilesRequestQuery) {
  if (!query.language) {
    return [];
  }

  const { data } = await apiClient.GET("/menus/files/", {
    params: { query },
  });

  return data ? parseTextFileMenuData(data) : [];
}
