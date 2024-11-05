import React, { memo } from "react";
import { Tree } from "react-arborist";
import { useRouter } from "next/router";
import {
  activeDbSourceTreeAtom,
  activeDbSourceTreeBreadcrumbsAtom,
  currentDbViewAtom,
  dbSourceFiltersSelectedIdsAtom,
} from "@atoms";
import type {
  DbSourceFilterSelectorTreeProps,
  DbSourceTreeBaseProps,
} from "@components/db/SearchableDbSourceTree/types";
import {
  getTreeKeyFromPath,
  handleTreeChange,
  isSearchMatch,
} from "@components/db/SearchableDbSourceTree/utils";
import { DbViewEnum } from "@utils/constants";
import { useAtomValue, useSetAtom } from "jotai";

import { DbSourceFilterTreeNode } from "./DbSourceFilterTreeNode";

export const DbSourceFilterSelectorTree = memo(
  function DbSourceFilterSelectorTree({
    data,
    height,
    width,
    searchTerm,
    filterSettingName,
  }: DbSourceTreeBaseProps & Omit<DbSourceFilterSelectorTreeProps, "type">) {
    const router = useRouter();

    const setActiveTree = useSetAtom(activeDbSourceTreeAtom);
    const setBreadcrumbs = useSetAtom(activeDbSourceTreeBreadcrumbsAtom);
    const dbSourceFiltersSelectedIds = useAtomValue(
      dbSourceFiltersSelectedIdsAtom,
    );

    const dbView = useAtomValue(currentDbViewAtom);

    const menuData = React.useMemo(() => {
      if (dbView === DbViewEnum.GRAPH) {
        const graphFilterData = data?.map((node) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, ...rest } = node;
          return { ...rest };
        });

        return graphFilterData;
      }

      return data;
    }, [data, dbView]);

    return (
      <Tree
        key={getTreeKeyFromPath(router.asPath, filterSettingName)}
        ref={(activeTree) => {
          handleTreeChange({ activeTree, setActiveTree, setBreadcrumbs });
        }}
        searchTerm={searchTerm}
        searchMatch={(node, term) => isSearchMatch(node.data.searchField, term)}
        initialData={menuData}
        openByDefault={false}
        rowHeight={46}
        disableDrag={true}
        disableDrop={true}
        dndRootElement={null}
        disableEdit={true}
        disableMultiSelection={false}
        padding={12}
        height={height}
        width={width}
        indent={16}
      >
        {(props) => (
          <DbSourceFilterTreeNode
            {...props}
            filterSettingName={filterSettingName}
            selectionIds={dbSourceFiltersSelectedIds[filterSettingName]}
          />
        )}
      </Tree>
    );
  },
);
