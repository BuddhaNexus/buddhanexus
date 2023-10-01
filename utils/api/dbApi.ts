import type { FilePropApiQuery, QueryParams } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { getParallelDownloadData } from "./downloads";
import { getGraphData } from "./graph";
import { getExternalLinksData } from "./links";
import {
  getCategoryMenuData,
  getSourceTextCollections,
  getSourceTextMenuData,
} from "./menus";
import { getNumbersData } from "./numbers";
import { getGlobalSearchData } from "./search";
import { getTableData } from "./table";
import { getTextData } from "./text";
import { getFolios, getParallelCount } from "./utils";

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
  TextView: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "textView",
      fileName,
      queryParams,
    ],
    call: getTextData,
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
