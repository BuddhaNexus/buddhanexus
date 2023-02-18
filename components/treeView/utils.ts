import { NodeDataChildType } from "@components/treeView/types";
import type { SourceTextBrowserData } from "types/api/sourceTextBrowser";

export function transformDataForTreeView(data: SourceTextBrowserData) {
  return data.map((collection) => ({
    id: collection.collection,
    name: collection.collection,
    dataType: NodeDataChildType.Collection,
    children: collection.categories.map(({ name, displayName, files }) => ({
      id: name,
      name: displayName,
      dataType: NodeDataChildType.Category,
      children: files.map(
        ({ fileName, displayName, textName, availableLanguages }) => ({
          id: textName,
          name: displayName,
          fileName,
          availableLanguages,
        })
      ),
    })),
  }));
}
