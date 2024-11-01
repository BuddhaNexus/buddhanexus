import React from "react";
import { DbSourceTreeNodeDataType as NodeType } from "@components/db/SearchableDbSourceTree/types";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShortTextIcon from "@mui/icons-material/ShortText";
import { SvgIconProps } from "@mui/material";

export function SourceTypeIcon({
  dataType,
  ...iconProps
}: SvgIconProps & {
  dataType: NodeType;
}) {
  switch (dataType) {
    case NodeType.TEXT: {
      return <ShortTextIcon {...iconProps} />;
    }
    case NodeType.CATEGORY: {
      return <MenuBookIcon {...iconProps} />;
    }
    default: {
      return <LibraryBooksIcon {...iconProps} />;
    }
  }
}
