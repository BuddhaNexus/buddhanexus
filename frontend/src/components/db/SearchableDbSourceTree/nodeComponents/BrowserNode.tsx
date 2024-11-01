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

type BrowserNodeProps = NodeRendererProps<DbSourceTreeNode>;

export function BrowserNode({ node, style }: BrowserNodeProps) {
  const { dataType } = node.data;

  return (
    <NodeBox
      key={node.id + node.level + node.childIndex}
      style={style}
      isSelected={node.isSelected}
      onClick={() => node.toggle()}
    >
      <ExpanderArrow node={node} />

      {dataType === NodeType.TEXT ? (
        <TextItemLink node={node} />
      ) : (
        <ParentItemExpander node={node} />
      )}
    </NodeBox>
  );
}
