import type { FilePropApiQuery, Params } from "utils/api/types/common";
import type { SourceLanguage } from "utils/constants";

import { getGraphData } from "./endpoints/graph-view/graph";
import { getExternalLinksData } from "./endpoints/links";
import { getCategoryMenuData } from "./endpoints/menus/category";
import { getSourceTextMenuData } from "./endpoints/menus/files";
import { getSourceTextCollections } from "./endpoints/menus/sidebar";
import { getNumbersViewCategories } from "./endpoints/numbers-view/categories";
import { getNumbersViewData } from "./endpoints/numbers-view/numbers";
import { getGlobalSearchData } from "./endpoints/search";
import { getParallelDownloadData } from "./endpoints/tabel-view/downloads";
import { getTableData } from "./endpoints/tabel-view/table";
import { getTextViewMiddleParallelsData } from "./endpoints/text-view/middle";
import { getTextViewParallelsData } from "./endpoints/text-view/text-parallels";
import {
  getAvailableLanguages,
  getFolios,
  getParallelCount,
  getTextDisplayName,
} from "./endpoints/utils/utils";

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
    call: getNumbersViewData,
  },
  NumbersViewCategories: {
    makeQueryKey: ({ fileName }: FilePropApiQuery) => [
      "numbersViewCategories",
      fileName,
    ],
    call: getNumbersViewCategories,
  },
  TextView: {
    makeQueryKey: ({ fileName, queryParams }: FilePropApiQuery) => [
      "textView",
      fileName,
      queryParams,
    ],
    call: getTextViewParallelsData,
  },
  TextViewMiddle: {
    makeQueryKey: (parallelIds: string[]) => parallelIds,
    call: getTextViewMiddleParallelsData,
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
  AvailableLanguagesData: {
    makeQueryKey: (fileName: string) => ["availableLanguagesData", fileName],
    call: getAvailableLanguages,
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
      searchString,
      queryParams,
    }: {
      searchString: string;
      queryParams: Params;
    }) => ["globalSearchData", searchString, queryParams],
    call: getGlobalSearchData,
  },
  TextDisplayName: {
    makeQueryKey: (fileName: string) => ["textNameData", fileName],
    call: getTextDisplayName,
  },
};
