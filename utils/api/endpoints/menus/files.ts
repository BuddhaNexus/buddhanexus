import apiClient from "@api";
import type { DatabaseText } from "utils/api/endpoints/menus/types";
import type { SourceLanguage } from "utils/constants";

export async function getSourceTextMenuData(
  language: SourceLanguage,
): Promise<DatabaseText[]> {
  if (!language) {
    return [];
  }

  const { data } = await apiClient.GET("/menus/files/", {
    params: { query: { language } },
  });

  return (
    data?.results?.map((text) => {
      const { displayName, search_field, textname, filename, category } = text;
      return {
        id: filename,
        name: displayName,
        label: search_field,
        fileName: filename,
        textName: textname,
        category,
      };
    }) ?? []
  );
}
