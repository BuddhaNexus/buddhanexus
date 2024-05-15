import { NodeDataChildType } from "@components/treeView/types";
import type { SourceTextBrowserData } from "utils/api/types/menus";

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
        ({
          fileName,
          displayName: fileDisplayName,
          textName,
          availableLanguages,
        }) => ({
          id: textName,
          name: fileDisplayName,
          fileName,
          availableLanguages,
          dataType: NodeDataChildType.Text,
        }),
      ),
    })),
  }));
}
