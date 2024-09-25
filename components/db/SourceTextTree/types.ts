import type { SourceLanguage } from "utils/constants";

export enum SourceTextTreeNodeDataType {
  Category = "category",
  Collection = "collection",
  Text = "text",
}

export type SourceTextTreeNode = {
  id: string;
  name: string;
  dataType: SourceTextTreeNodeDataType;
  children?: SourceTextTreeNode[];
  fileName?: string;
  availableLanguages?: SourceLanguage[];
};
