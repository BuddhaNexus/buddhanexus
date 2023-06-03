// source text collections
import { transformDataForTreeView } from "@components/treeView/utils";
import type {
  ApiSourceTextBrowserData,
  SourceTextBrowserData,
} from "types/api/sourceTextBrowser";
import type { SourceLanguage } from "utils/constants";

import { API_ROOT_URL } from "./constants";

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
  const res = await fetch(
    `${API_ROOT_URL}/menus/sidebar/?language=${language}`
  );
  const response = await res.json();

  const parsedApiData = parseSourceTextCollectionData(response);
  return transformDataForTreeView(parsedApiData);
}
