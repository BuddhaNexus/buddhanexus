import type { SourceLanguage } from "utils/constants";

import { getFolios, getParallelCount, getSegmentsData } from "./common";
import { getParallelDownloadData } from "./downloads";
import { getExternalLinksData } from "./externalLinks";
import { getGraphData } from "./graph";
import { getLanguageMenuData } from "./languageMenu";
import { getSourceTextCollections } from "./sidebarSourceTexts";
import { getTableData } from "./table";
import { getCategoryMenuItems, getTextMenuItems } from "./textLists";

export const DbApi = {
  LanguageMenu: {
    makeQueryKey: (language: SourceLanguage) => ["languageMenuData", language],
    call: getLanguageMenuData,
  },
  SidebarSourceTexts: {
    makeQueryKey: (language: SourceLanguage) => ["textCollections", language],
    call: getSourceTextCollections,
  },
  GraphView: {
    makeQueryKey: (fileName: string) => ["graphView", fileName],
    call: getGraphData,
  },
  TableView: {
    makeQueryKey: (fileName: string) => ["tableView", fileName],
    call: getTableData,
  },
  SegmentsData: {
    makeQueryKey: (fileName: string) => ["segmentsData", fileName],
    call: getSegmentsData,
  },
  TextMenu: {
    makeQueryKey: (language: SourceLanguage) => ["textMenu", language],
    call: getTextMenuItems,
  },
  CategoryMenu: {
    makeQueryKey: (language: SourceLanguage) => ["categoryMenu", language],
    call: getCategoryMenuItems,
  },
  ParallelCount: {
    makeQueryKey: (fileName: string) => ["parallelCount", fileName],
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
    makeQueryKey: (fileName: string) => ["downloadData", fileName],
    call: getParallelDownloadData,
  },
};
