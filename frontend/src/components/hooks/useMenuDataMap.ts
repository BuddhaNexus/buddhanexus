import React from "react";
import type { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";

export const useMenuDataFileMap = (enabled = false) => {
  const { dbLanguage: language } = useDbPageRouterParams();

  const { data: menuData } = useQuery<DbSourceTreeNode[]>({
    queryKey: DbApi.DbSourcesMenu.makeQueryKey(language),
    queryFn: () => DbApi.DbSourcesMenu.call({ language }),
    enabled,
  });

  return React.useMemo(() => {
    if (!menuData) return {};

    const map: Record<string, DbSourceTreeNode> = {};
    const processNode = (node: DbSourceTreeNode) => {
      if (node.displayId) {
        map[node.id] = node;
      }
      node.children?.forEach(processNode);
    };
    menuData.forEach(processNode);
    return map;
  }, [menuData]);
};
