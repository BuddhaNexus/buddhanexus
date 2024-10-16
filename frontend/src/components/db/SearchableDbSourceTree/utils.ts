import { NodeApi, TreeApi } from "react-arborist";
import {
  DbSourceTreeNode,
  DbSourceTreeNodeDataType,
} from "@components/db/SearchableDbSourceTree/types";
import type { ParsedStructuredDbSourceMenuData } from "@utils/api/endpoints/menus/sources";

export function transformDataForTreeView(
  data: ParsedStructuredDbSourceMenuData
) {
  /**
   * TODO - check if:
   *  - if it's possible to enforce id uniqueness on BE - duplicate `id`s (eg. dhp) cause react-arborist to trigger key errors and rendering issues. Creating unique ids on FE breaks currnet file selection.
   * */
  return data.map((collection) => ({
    id: collection.collection,
    name: collection.collection,
    searchField: collection.collection,
    dataType: DbSourceTreeNodeDataType.Collection,
    children: collection.categories.map(({ name, displayName, files }) => ({
      id: name,
      name: displayName,
      dataType: DbSourceTreeNodeDataType.Category,
      searchField: `${displayName}/${name}`,
      children: files.map(
        ({ fileName, displayName: fileDisplayName, searchField }) => ({
          id: fileName,
          name: fileDisplayName,
          fileName,
          dataType: DbSourceTreeNodeDataType.Text,
          searchField,
        })
      ),
    })),
  }));
}

export function getTreeKeyFromPath(path: string, suffix?: string) {
  return `${path.replace(/\?.*/, "")}-${suffix}`;
}

export function getTreeBreadcrumbs(node: NodeApi<DbSourceTreeNode>) {
  const crumbs = [];
  let current: NodeApi<DbSourceTreeNode> | null = node;

  while (current && current.level >= 0) {
    crumbs.unshift(current);
    current = current.parent;
  }

  return crumbs;
}

type InitializeTreeProps = {
  activeTree: TreeApi<DbSourceTreeNode> | null | undefined;
  setActiveTree: React.Dispatch<
    React.SetStateAction<TreeApi<DbSourceTreeNode> | null | undefined>
  >;
  setBreadcrumbs: React.Dispatch<
    React.SetStateAction<NodeApi<DbSourceTreeNode>[]>
  >;
};

export const handleTreeChange = ({
  activeTree,
  setActiveTree,
  setBreadcrumbs,
}: InitializeTreeProps) => {
  setActiveTree(activeTree);
  const selectedFileNode = activeTree?.selectedNodes[0];

  if (!selectedFileNode) {
    setBreadcrumbs([]);
    return;
  }

  const crumbs = getTreeBreadcrumbs(selectedFileNode);

  if (selectedFileNode.isLeaf) {
    crumbs.pop();
  }

  setBreadcrumbs(crumbs);
};
