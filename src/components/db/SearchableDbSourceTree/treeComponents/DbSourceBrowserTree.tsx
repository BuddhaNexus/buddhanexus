import { memo } from "react";
import { Tree } from "react-arborist";
import { useRouter } from "next/router";
import { activeDbSourceBrowserTreeAtom } from "@atoms";
import { BrowserNode } from "@components/db/SearchableDbSourceTree/nodeComponents/BrowserNode";
import { DbSourceTreeBaseProps } from "@components/db/SearchableDbSourceTree/types";
import { getTreeKeyFromPath } from "@components/db/SearchableDbSourceTree/utils";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSetAtom } from "jotai";

const DbSourceBrowserTree = memo(function DbSourceBrowserTree({
  data,
  height,
  width,
  searchTerm,
}: DbSourceTreeBaseProps) {
  const router = useRouter();
  const { fileName } = useDbQueryParams();

  const setActiveDbSourceBrowserTree = useSetAtom(
    activeDbSourceBrowserTreeAtom,
  );

  return (
    <Tree
      key={getTreeKeyFromPath(router.asPath)}
      ref={(tree) => setActiveDbSourceBrowserTree(tree)}
      selectionFollowsFocus={false}
      searchTerm={searchTerm}
      initialData={data}
      openByDefault={false}
      disableDrag={true}
      rowHeight={64}
      disableDrop={true}
      disableEdit={true}
      padding={12}
      height={height}
      width={width}
      selection={fileName}
    >
      {(props) => <BrowserNode currentFile={fileName} {...props} />}
    </Tree>
  );
});

export default DbSourceBrowserTree;
