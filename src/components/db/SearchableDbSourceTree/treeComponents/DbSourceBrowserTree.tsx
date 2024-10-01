import { memo } from "react";
import { Tree } from "react-arborist";
import { useRouter } from "next/router";
import { BrowserNode } from "@components/db/SearchableDbSourceTree/nodeComponents/BrowserNode";
import { DbSourceTreeBaseProps } from "@components/db/SearchableDbSourceTree/types";
import { getTreeKeyFromPath } from "@components/db/SearchableDbSourceTree/utils";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";

const DbSourceBrowserTree = memo(function DbSourceBrowserTree({
  data,
  height,
  width,
  searchTerm,
}: DbSourceTreeBaseProps) {
  const router = useRouter();
  const { fileName } = useDbQueryParams();

  return (
    <Tree
      key={getTreeKeyFromPath(router.asPath)}
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
      {BrowserNode}
    </Tree>
  );
});

export default DbSourceBrowserTree;
