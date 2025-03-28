import { memo } from "react";
import { Tree } from "react-arborist";
import { useRouter } from "next/router";
import {
  activeDbSourceTreeAtom,
  activeDbSourceTreeBreadcrumbsAtom,
  focusedDbSourceTreeNodeAtom,
} from "@atoms";
import { BrowserNode } from "@components/db/SearchableDbSourceTree/nodeComponents/BrowserNode";
import { DbSourceTreeBaseProps } from "@components/db/SearchableDbSourceTree/types";
import {
  getTreeKeyFromPath,
  handleTreeChange,
  isSearchMatch,
} from "@components/db/SearchableDbSourceTree/utils";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { useSetAtom } from "jotai";

const DbSourceBrowserTree = memo(function DbSourceBrowserTree({
  data,
  height,
  width,
  searchTerm,
}: DbSourceTreeBaseProps) {
  const router = useRouter();
  const { fileName } = useDbPageRouterParams();

  const setActiveTree = useSetAtom(activeDbSourceTreeAtom);
  const setBreadcrumbs = useSetAtom(activeDbSourceTreeBreadcrumbsAtom);
  const setFocusedDbSourceTreeNode = useSetAtom(focusedDbSourceTreeNodeAtom);

  return (
    <Tree
      key={getTreeKeyFromPath(router.asPath)}
      ref={(activeTree) => {
        handleTreeChange({ activeTree, setActiveTree, setBreadcrumbs });
      }}
      searchTerm={searchTerm}
      searchMatch={(node, term) => isSearchMatch(node.data.searchField, term)}
      initialData={data}
      openByDefault={false}
      disableDrag={true}
      disableDrop={true}
      dndRootElement={null}
      disableEdit={true}
      height={height - 60} // 60 offsets menu head
      width={width}
      rowHeight={64}
      padding={12}
      selection={fileName}
      onFocus={(node) => setFocusedDbSourceTreeNode(node)}
    >
      {(props) => {
        return <BrowserNode {...props} />;
      }}
    </Tree>
  );
});

export default DbSourceBrowserTree;
