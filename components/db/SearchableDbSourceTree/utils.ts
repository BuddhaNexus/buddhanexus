import { DbSourceTreeNodeDataType } from "@components/db/SearchableDbSourceTree/types";
import type { ParsedStructuredDbSourceMenuData } from "utils/api/endpoints/menus/sidebar";

export function transformDataForTreeView(
  data: ParsedStructuredDbSourceMenuData,
) {
  return data.map((collection) => ({
    id: collection.collection,
    name: collection.collection,
    dataType: DbSourceTreeNodeDataType.Collection,
    children: collection.categories.map(({ name, displayName, files }) => ({
      id: name,
      name: displayName,
      dataType: DbSourceTreeNodeDataType.Category,
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
          dataType: DbSourceTreeNodeDataType.Text,
        }),
      ),
    })),
  }));
}
