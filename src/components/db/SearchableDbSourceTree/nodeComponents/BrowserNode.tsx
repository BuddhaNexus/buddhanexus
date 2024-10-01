import React from "react";
import { NodeRendererProps } from "react-arborist";
import {
  DbSourceTreeNode,
  DbSourceTreeNodeDataType as NodeType,
} from "@components/db/SearchableDbSourceTree/types";

import { ExpanderArrow } from "./ExpanderArrow";
import { ParentItemExpander } from "./ParentItemExpander";
import { NodeBox } from "./styledComponents";
import { TextItemLink } from "./TextItemLink";

export function BrowserNode({
  node,
  style,
}: NodeRendererProps<DbSourceTreeNode>) {
  const { dataType } = node.data;

  const handleClick = () => {
    if (node.isInternal) {
      node.toggle();
    }
  };

  return (
    <NodeBox style={style} isSelected={node.isSelected} onClick={handleClick}>
      <ExpanderArrow node={node} />

      {dataType === NodeType.Text ? (
        <TextItemLink node={node} />
      ) : (
        <ParentItemExpander node={node} />
      )}
    </NodeBox>
  );
}
