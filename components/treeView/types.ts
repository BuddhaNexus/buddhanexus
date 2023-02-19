export enum NodeDataChildType {
  Category = "category",
  Collection = "collection",
  Text = "text",
}

export type DrawerNavigationNodeData = {
  id: string;
  name: string;
  fileName?: string;
  availableLanguages?: string | null;
  dataType?: NodeDataChildType;
};
