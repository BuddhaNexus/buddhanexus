import { DbSourceFilterUISetting } from "@features/SidebarSuite/types";

export enum DbSourceTreeNodeDataType {
  Category = "category",
  Collection = "collection",
  Text = "text",
}

export type DbSourceTreeNode = {
  id: string;
  name: string;
  dataType: DbSourceTreeNodeDataType;
  children?: DbSourceTreeNode[];
  fileName?: string;
  searchField: string;
};

export enum DbSourceTreeType {
  BROWSER = "browser",
  FILTER_SELECTOR = "filter-selector",
}

export type DbSourceTreeBaseProps = {
  data: DbSourceTreeNode[];
  height: number;
  width: number;
  searchTerm?: string;
};

export type BrowserTreeProps = {
  type: DbSourceTreeType.BROWSER;
};

export type DbSourceFilterSelectorTreeProps = {
  type: DbSourceTreeType.FILTER_SELECTOR;
  filterSettingName: DbSourceFilterUISetting;
};

export type DbSourceTreeProps = DbSourceTreeBaseProps &
  (
    | ({ type: DbSourceTreeType.BROWSER } & BrowserTreeProps)
    | ({
        type: DbSourceTreeType.FILTER_SELECTOR;
      } & DbSourceFilterSelectorTreeProps)
  );
