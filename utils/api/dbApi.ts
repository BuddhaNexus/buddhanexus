import type { SourceLanguage } from "utils/constants";

import {
  getCategoryMenuData,
  getFolios,
  getParallelCount,
  getSegmentsData,
} from "./common";
import { getGraphData } from "./graph";
import { getLanguageMenuData } from "./languageMenu";
import { getSourceTextCollections } from "./sidebarSourceTexts";
import { getTableData } from "./table";

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
  CategoryMenu: {
    makeQueryKey: (language: SourceLanguage) => ["categoryMenuData", language],
    call: getCategoryMenuData,
  },
  ParallelCount: {
    makeQueryKey: (fileName: string) => ["parallelCount", fileName],
    call: getParallelCount,
  },
  FolioData: {
    makeQueryKey: (fileName: string) => ["foliosData", fileName],
    call: getFolios,
  },
};
