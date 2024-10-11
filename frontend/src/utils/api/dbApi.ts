import type {
  APIGeneralInput,
  APINumbersViewCategoryRequestQuery,
  APISearchRequestBody,
} from "@utils/api/types";
import type { SourceLanguage } from "@utils/constants";

import { getGraphData } from "./endpoints/graph-view/graph";
import { getExternalLinksData } from "./endpoints/links";
import { getCategoryMenuData } from "./endpoints/menus/category";
import { getTextFileMenuData } from "./endpoints/menus/files";
import { getSidebarTextCollectionsMenuData } from "./endpoints/menus/sidebar";
import { getNumbersViewCategories } from "./endpoints/numbers-view/categories";
import { getNumbersViewData } from "./endpoints/numbers-view/numbers";
import { getGlobalSearchData } from "./endpoints/search";
import { getParallelDownloadData } from "./endpoints/table-view/downloads";
import { getTableData } from "./endpoints/table-view/table";
import { getTextViewMiddleParallelsData } from "./endpoints/text-view/middle";
import { getTextViewParallelsData } from "./endpoints/text-view/text-parallels";
import { getAvailableLanguages } from "./endpoints/utils/available-languages";
import { getCountMatches } from "./endpoints/utils/count-matches";
import { getTextDisplayName } from "./endpoints/utils/displayname";
import { getFolios } from "./endpoints/utils/folios";

export const DbApi = {
  //* VIEWS
  GraphView: {
    makeQueryKey: (params: APIGeneralInput) => ["graphView", params],
    call: getGraphData,
  },
  TableView: {
    makeQueryKey: (params: APIGeneralInput) => ["tableView", params],
    call: getTableData,
  },
  NumbersView: {
    makeQueryKey: (params: APIGeneralInput) => ["numbersView", params],
    call: getNumbersViewData,
  },
  NumbersViewCategories: {
    makeQueryKey: (query: APINumbersViewCategoryRequestQuery) => [
      "numbersViewCategories",
      query,
    ],
    call: getNumbersViewCategories,
  },
  TextView: {
    makeQueryKey: (params: APIGeneralInput, selectedSegment?: string) => [
      "textView",
      params,
      selectedSegment,
    ],
    call: getTextViewParallelsData,
  },
  TextViewMiddle: {
    makeQueryKey: (parallelIds: string[]) => parallelIds,
    call: getTextViewMiddleParallelsData,
  },
  //* MENUS
  DbSourceMenu: {
    makeQueryKey: (language: SourceLanguage) => [
      "sourceTextMenuData",
      language,
    ],
    call: getTextFileMenuData,
  },
  CategoryMenu: {
    makeQueryKey: (language: SourceLanguage) => ["categoryMenuData", language],
    call: getCategoryMenuData,
  },
  DbSourcesMenu: {
    makeQueryKey: (language: SourceLanguage) => [
      "textCollectionsData",
      language,
    ],
    call: getSidebarTextCollectionsMenuData,
  },
  //* UTILS / SETTINGS
  ParallelCount: {
    makeQueryKey: (params: APIGeneralInput) => ["parallelCountData", params],
    call: getCountMatches,
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
    makeQueryKey: (params: APIGeneralInput) => ["downloadData", params],
    call: getParallelDownloadData,
  },
  GlobalSearchData: {
    makeQueryKey: (query: APISearchRequestBody) => ["globalSearchData", query],
    call: getGlobalSearchData,
  },
  TextDisplayName: {
    makeQueryKey: (fileName: string) => ["textNameData", fileName],
    call: getTextDisplayName,
  },
};
