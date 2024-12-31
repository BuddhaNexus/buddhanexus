import type { APIGetRequestQuery, APIPostRequestBody } from "@utils/api/types";
import { DbLanguage } from "@utils/api/types";

import { getParallelDownloadData } from "./endpoints/download";
import { getGraphData } from "./endpoints/graph-view/graph";
import { getExternalLinksData } from "./endpoints/links";
import { getDbSourceMenuData } from "./endpoints/menudata";
import { getNumbersViewCategories } from "./endpoints/numbers-view/categories";
import { getNumbersViewData } from "./endpoints/numbers-view/numbers";
import { getGlobalSearchData } from "./endpoints/search";
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
      params: Omit<APIPostRequestBody<"/table-view/table/">, "page">,
    ) => ["tableView", params],
    call: getTableData,
  },
  NumbersView: {
    makeQueryKey: (
      params: Omit<APIPostRequestBody<"/numbers-view/numbers/">, "page">,
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
      params: Omit<APIPostRequestBody<"/text-view/text-parallels/">, "page">,
    ) => ["textView", params],
    call: getTextViewParallelsData,
  },
  TextViewMiddle: {
    makeQueryKey: (parallelIds: string[]) => ["textMiddleView", parallelIds],
    call: getTextViewMiddleParallelsData,
  },
  //* MENU
  DbSourcesMenu: {
    makeQueryKey: (language: DbLanguage) => ["textCollectionsData", language],
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
    makeQueryKey: (params: APIPostRequestBody<"/download/">) => [
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
