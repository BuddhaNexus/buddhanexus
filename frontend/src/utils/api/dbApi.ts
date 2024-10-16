import type { APIGetRequestQuery, APIPostRequestBody } from "@utils/api/types";
import type { SourceLanguage } from "@utils/constants";

import { getGraphData } from "./endpoints/graph-view/graph";
import { getExternalLinksData } from "./endpoints/links";
import { getDbSourceMenuData } from "./endpoints/menus/sources";
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
    makeQueryKey: (params: APIPostRequestBody<"/graph-view/">) => [
      "graphView",
      params,
    ],
    call: getGraphData,
  },
  TableView: {
    makeQueryKey: (
      params: Omit<APIPostRequestBody<"/table-view/table">, "page">
    ) => ["tableView", params],
    call: getTableData,
  },
  NumbersView: {
    makeQueryKey: (
      params: Omit<APIPostRequestBody<"/numbers-view/numbers/">, "page">
    ) => ["numbersView", params],
    call: getNumbersViewData,
  },
  NumbersViewCategories: {
    makeQueryKey: (query: APIGetRequestQuery<"/numbers-view/categories/">) => [
      "numbersViewCategories",
      query,
    ],
    call: getNumbersViewCategories,
  },
  TextView: {
    makeQueryKey: (
      params: APIPostRequestBody<"/text-view/text-parallels/">,
      selectedSegment?: string
    ) => ["textView", params, selectedSegment],
    call: getTextViewParallelsData,
  },
  TextViewMiddle: {
    makeQueryKey: (parallelIds: string[]) => parallelIds,
    call: getTextViewMiddleParallelsData,
  },
  //* MENUS
  DbSourcesMenu: {
    makeQueryKey: (language: SourceLanguage) => [
      "textCollectionsData",
      language,
    ],
    call: getDbSourceMenuData,
  },
  //* UTILS / SETTINGS
  ParallelCount: {
    makeQueryKey: (params: APIPostRequestBody<"/utils/count-matches/">) => [
      "parallelCountData",
      params,
    ],
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
    makeQueryKey: (params: APIPostRequestBody<"/table-view/download">) => [
      "downloadData",
      params,
    ],
    call: getParallelDownloadData,
  },
  GlobalSearchData: {
    makeQueryKey: (query: APIPostRequestBody<"/search/">) => [
      "globalSearchData",
      query,
    ],
    call: getGlobalSearchData,
  },
  TextDisplayName: {
    makeQueryKey: (fileName: string) => ["textNameData", fileName],
    call: getTextDisplayName,
  },
};
