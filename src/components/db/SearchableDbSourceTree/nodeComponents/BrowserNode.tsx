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

type BrowserNodeProps = NodeRendererProps<DbSourceTreeNode> & {
  currentFile: string;
};

export function BrowserNode({ node, style, currentFile }: BrowserNodeProps) {
  const { dataType, id } = node.data;

  const handleClick = () => {
    if (node.isInternal) {
      node.toggle();
    }
  };

  return (
    <NodeBox
      style={style}
      isSelected={currentFile === id}
      onClick={handleClick}
    >
      <ExpanderArrow node={node} />

      {dataType === NodeType.Text ? (
        <TextItemLink node={node} />
      ) : (
        <ParentItemExpander node={node} />
      )}
    </NodeBox>
  );
}
