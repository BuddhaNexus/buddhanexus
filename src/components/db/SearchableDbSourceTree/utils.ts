import { NodeApi, TreeApi } from "react-arborist";
import {
  DbSourceTreeNode,
  DbSourceTreeNodeDataType,
} from "@components/db/SearchableDbSourceTree/types";
import type { ParsedStructuredDbSourceMenuData } from "@utils/api/endpoints/menus/sidebar";

export function transformDataForTreeView(
  data: ParsedStructuredDbSourceMenuData,
) {
  /**
   * TODO - check if:
   *  - BE prop naming is correct (fileName vs textName)
   *  - if it's possible to enforce id uniqueness on BE - duplicate `id`s (eg. dhp) cause react-arborist to trigger key errors and rendering issues. Creating unique ids on FE breaks currnet file selection.
   * */
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

export function getTreeBreadcruumbs(node: NodeApi<DbSourceTreeNode>) {
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
  setBreacrumbs: React.Dispatch<
    React.SetStateAction<NodeApi<DbSourceTreeNode>[]>
  >;
};

export const handleTreeChange = ({
  activeTree,
  setActiveTree,
  setBreacrumbs,
}: InitializeTreeProps) => {
  setActiveTree(activeTree);
  const selectedFileNode = activeTree?.selectedNodes[0];

  if (!selectedFileNode) {
    setBreacrumbs([]);
    return;
  }

  const crumbs = getTreeBreadcruumbs(selectedFileNode);

  if (selectedFileNode.isLeaf) {
    crumbs.pop();
  }

  setBreacrumbs(crumbs);
};
