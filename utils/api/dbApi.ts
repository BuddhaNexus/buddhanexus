import type { FilePropApiQuery } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { getFolios, getParallelCount, getSegmentsData } from "./common";
import { getParallelDownloadData } from "./downloads";
import { getExternalLinksData } from "./externalLinks";
import { getGraphData } from "./graph";
import { getLanguageMenuData } from "./languageMenu";
import { getNumbersData } from "./numbers";
import { getSourceTextCollections } from "./sidebarSourceTexts";
import { getTableData } from "./table";
import { getCategoryMenuItems, getTextMenuItems } from "./textLists";

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
    makeQueryKey: (fileName: string) => ["tableView", fileName],
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
  SegmentsData: {
    makeQueryKey: (fileName: string) => ["segmentsData", fileName],
    call: getSegmentsData,
  },
  LanguageMenu: {
    makeQueryKey: (language: SourceLanguage) => ["languageMenuData", language],
    call: getLanguageMenuData,
  },
  TextMenu: {
    makeQueryKey: (language: SourceLanguage) => ["textMenu", language],
    call: getTextMenuItems,
  },
  CategoryMenu: {
    makeQueryKey: (language: SourceLanguage) => ["categoryMenu", language],
    call: getCategoryMenuItems,
  },
  SidebarSourceTexts: {
    makeQueryKey: (language: SourceLanguage) => ["textCollections", language],
    call: getSourceTextCollections,
  },
  //* META
  ParallelCount: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "parallelCount",
      fileName,
      queryParams,
    ],
    call: getParallelCount,
  },
  //* UTILS / SETTINGS
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
};
