import { SourceTextTreeNodeDataType } from "@components/db/SourceTextTree/types";
import type { ParsedStructuredSourceTextMenuData } from "utils/api/endpoints/menus/sidebar";

export function transformDataForTreeView(
  data: ParsedStructuredSourceTextMenuData,
) {
  return data.map((collection) => ({
    id: collection.collection,
    name: collection.collection,
    dataType: SourceTextTreeNodeDataType.Collection,
    children: collection.categories.map(({ name, displayName, files }) => ({
      id: name,
      name: displayName,
      dataType: SourceTextTreeNodeDataType.Category,
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
          dataType: SourceTextTreeNodeDataType.Text,
        }),
      ),
    })),
  }));
}
