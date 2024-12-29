import apiClient from "@api";
import { transformDataForTreeView } from "@components/db/SearchableDbSourceTree/utils";
import type {
  APIGetRequestQuery,
  // APIGetResponse,
  APISchemas,
} from "@utils/api/types";

type TEMP_FIX_FILE = {
  displayName: string;
  filename: string;
  search_field: string;
  textname: string;
};

type TEMP_FIX_CATEGORY = Omit<APISchemas["Category"], "files"> & {
  files: TEMP_FIX_FILE[];
};

type TEMP_FIX_COLLECTION = {
  collection: string;
  categories: TEMP_FIX_CATEGORY[];
};

type TEMP_FIX_API_MENUDATA = {
  menudata: TEMP_FIX_COLLECTION[];
};

function parseStructuredDbSourceMenuData(data: TEMP_FIX_API_MENUDATA) {
  return data.menudata.map(({ collection, categories }) => ({
    collection,
    categories: categories.map(
      ({ files, categorydisplayname, category: categoryName }) => ({
        files: files.map(
          ({ displayName, filename, search_field, textname }) => ({
            displayName,
            displayId: textname,
            searchField: search_field,
            fileName: filename,
            category: categoryName,
          }),
        ),
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
  query: APIGetRequestQuery<"/menudata/">,
) {
  const { data } = await apiClient.GET("/menudata/", {
    params: { query },
  });

  const parsedApiData = data
    ? parseStructuredDbSourceMenuData(data as TEMP_FIX_API_MENUDATA)
    : [];
  return transformDataForTreeView(parsedApiData);
}
