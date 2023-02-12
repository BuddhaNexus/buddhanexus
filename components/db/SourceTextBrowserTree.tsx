import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem } from "@mui/lab";
import TreeView from "@mui/lab/TreeView";
import { useQuery } from "@tanstack/react-query";
import type { ApiSourceTextBrowserData } from "types/api/common";
import { DbApi } from "utils/api/dbApi";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

export function SourceTextBrowserTree() {
  const { sourceLanguage } = useDbQueryParams();

  // TODO: add error handling
  const { data, isLoading } = useQuery<ApiSourceTextBrowserData>({
    queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
  });

  console.log({ data });

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, overflowY: "auto" }}
    >
      <TreeItem nodeId="1" label="Applications">
        <TreeItem nodeId="2" label="Calendar" />
      </TreeItem>
      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="6" label="MUI">
          <TreeItem nodeId="8" label="index.js" />
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
}
