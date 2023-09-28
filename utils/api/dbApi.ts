import type { FilePropApiQuery, QueryParams } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { getFolios, getParallelCount } from "./utils";
import { getParallelDownloadData } from "./downloads";
import { getExternalLinksData } from "./links";
import { getGraphData } from "./graph";
import {
  getSourceTextCollections,
  getSourceTextMenuData,
  getCategoryMenuData,
} from "./menus";
import { getNumbersData } from "./numbers";
import { getGlobalSearchData } from "./search";
import { getTableData } from "./table";

export const DbApi = {
  //* VIEWS
  GraphView: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "graphView",
      fileName,
      queryParams,
    ],
    call: getGraphData,
  },
  TableView: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "tableView",
      fileName,
      queryParams,
    ],
    call: getTableData,
  },
  NumbersView: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "numbersView",
      fileName,
      queryParams,
    ],
    call: getNumbersData,
  },
  //* MENUS
  SourceTextMenu: {
    makeQueryKey: (language: SourceLanguage) => [
      "sourceTextMenuData",
      language,
    ],
    call: getSourceTextMenuData,
  },
  CategoryMenu: {
    makeQueryKey: (language: SourceLanguage) => ["categoryMenuData", language],
    call: getCategoryMenuData,
  },
  SidebarSourceTexts: {
    makeQueryKey: (language: SourceLanguage) => [
      "textCollectionsData",
      language,
    ],
    call: getSourceTextCollections,
  },
  //* UTILS / SETTINGS
  ParallelCount: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "parallelCountData",
      fileName,
      queryParams,
    ],
    call: getParallelCount,
  },
  FolioData: {
    makeQueryKey: (fileName: string) => ["foliosData", fileName],
    call: getFolios,
  },
  ExternalLinksData: {
    makeQueryKey: (fileName: string) => ["externalLinkData", fileName],
    call: getExternalLinksData,
  },
  DownloadResults: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "downloadData",
      fileName,
      queryParams,
    ],
    call: getParallelDownloadData,
  },
  GlobalSearchData: {
    makeQueryKey: ({
      searchTerm,
      queryParams,
    }: {
      searchTerm: string;
      queryParams: QueryParams;
    }) => ["globalSearchData", searchTerm, queryParams],
    call: getGlobalSearchData,
  },
};
