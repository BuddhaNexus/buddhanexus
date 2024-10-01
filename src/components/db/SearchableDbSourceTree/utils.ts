import { DbSourceTreeNodeDataType } from "@components/db/SearchableDbSourceTree/types";
import type { ParsedStructuredDbSourceMenuData } from "@utils/api/endpoints/menus/sidebar";

export function transformDataForTreeView(
  data: ParsedStructuredDbSourceMenuData,
) {
  // TODO: check if BE prop naming is correct (fileName vs textName)
  return data.map((collection) => ({
    id: collection.collection,
    name: collection.collection,
    dataType: DbSourceTreeNodeDataType.Collection,
    children: collection.categories.map(({ name, displayName, files }) => ({
      id: name,
      name: displayName,
      dataType: DbSourceTreeNodeDataType.Category,
      children: files.map(
        ({ fileName, displayName: fileDisplayName, availableLanguages }) => ({
          id: fileName,
          name: fileDisplayName,
          fileName,
          availableLanguages,
          dataType: DbSourceTreeNodeDataType.Text,
        }),
      ),
    })),
  }));
}

export function getTreeKeyFromPath(path: string, suffix?: string) {
  return `${path.replace(/\?.*/, "")}-${suffix}`;
}
