import type { SourceLanguage } from "utils/constants";

// eslint-disable-next-line no-shadow
export enum NodeDataChildType {
  Category = "category",
  Collection = "collection",
  Text = "text",
}

export type DrawerNavigationNodeData = {
  id: string;
  name: string;
  fileName?: string;
  availableLanguages?: SourceLanguage[];
  dataType?: NodeDataChildType;
};
