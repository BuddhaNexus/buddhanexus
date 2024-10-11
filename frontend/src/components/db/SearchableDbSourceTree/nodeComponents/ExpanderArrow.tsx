import React from "react";
import { NodeApi } from "react-arborist";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export function ExpanderArrow({
  node,
  mr = 1,
}: {
  node: NodeApi<any>;
  mr?: number;
}) {
  if (!node.isInternal) return null;

  return (
    <ChevronRightIcon
      sx={{
        mr,
        transform: node.isOpen ? "rotate(90deg)" : undefined,
        transition: "transform 200ms",
      }}
    />
  );
}
