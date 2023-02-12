import { memo } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem } from "@mui/lab";
import TreeView from "@mui/lab/TreeView";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { SourceTextBrowserData } from "types/api/sourceTextBrowser";
import { DbApi } from "utils/api/dbApi";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

const TreeViewContent = memo(function TreeViewContent({
  data,
}: {
  data: SourceTextBrowserData;
}) {
  return (
    <>
      {data.map((collection) => (
        <TreeItem
          key={collection.collection}
          nodeId={collection.collection}
          label={collection.collection}
        >
          {collection.categories.map((category) => (
            <TreeItem
              key={category.name}
              nodeId={category.name}
              label={category.displayName}
            >
              {category.files.map((file) => (
                <TreeItem
                  key={file.fileName}
                  nodeId={file.fileName}
                  label={file.displayName}
                />
              ))}
            </TreeItem>
          ))}
        </TreeItem>
      ))}
    </>
  );
});

export const SourceTextBrowserTree = memo(function SourceTextBrowserTree() {
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation();

  // TODO: add error handling
  const { data, isLoading } = useQuery<SourceTextBrowserData>({
    queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
  });

  return (
    <TreeView
      aria-label={t("textBrowser.label")}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ minWidth: 350, flexGrow: 1, overflowY: "auto" }}
    >
      {isLoading || !data ? (
        <CircularProgress />
      ) : (
        <TreeViewContent data={data} />
      )}
    </TreeView>
  );
});
