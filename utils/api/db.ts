import type {
  DatabaseCategory,
  DatabaseFolio,
  DatabaseText,
} from "@components/db/types";
import type {
  ApiCategoryMenuData,
  ApiFolioData,
  ApiGraphPageData,
  ApiLanguageMenuData,
  ApiSegmentsData,
  PagedResponse,
} from "types/api/common";
import type { ApiTablePageData, TablePageData } from "types/api/table";
import type { SourceLanguage } from "utils/constants";

const API_ROOT_URL = process.env.NEXT_PUBLIC_API_URL;

// source language menu on main db page (Autocomplete component)
export async function getLanguageMenuData(
  language: SourceLanguage
): Promise<DatabaseText[]> {
  const res = await fetch(`${API_ROOT_URL}/menus/${language}`);
  const response = await res.json();

  // TODO: Add pagination on BE
  return response.result.map((menuItem: ApiLanguageMenuData) => ({
    label: menuItem.search_field,
    id: menuItem.search_field,
    name: menuItem.displayName,
    fileName: menuItem.filename,
    textName: menuItem.textname,
    category: menuItem.category,
  }));
}

// graph view
async function getGraphData(fileName: string): Promise<ApiGraphPageData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/graph?co_occ=2000`
  );
  return await res.json();
}

function parseAPITableData(apiData: ApiTablePageData): TablePageData {
  return apiData.map((p) => ({
    coOccurrences: p["co-occ"],
    sourceLanguage: p.src_lang,
    targetLanguage: p.tgt_lang,
    fileName: p.file_name,
    score: p.score,

    parallelFullNames: {
      displayName: p.par_full_names.display_name,
      textName: p.par_full_names.text_name,
      link1: p.par_full_names.link1,
      link2: p.par_full_names.link2,
    },
    parallelFullText: p.par_fulltext,
    parallelLength: p.par_length,
    parallelPositionFromStart: p.par_pos_beg,
    parallelSegmentNumbers: p.par_segnr,

    rootLength: p.root_length,
    rootSegmentNumbers: p.root_segnr,
    rootFullNames: {
      displayName: p.root_full_names.display_name,
      textName: p.root_full_names.text_name,
      link1: p.root_full_names.link1,
      link2: p.root_full_names.link2,
    },
    rootFullText: p.root_fulltext,
  }));
}

async function getTableData({
  fileName,
  pageNumber,
  params,
}: {
  fileName: string;
  pageNumber: number;
  params: string;
}): Promise<PagedResponse<TablePageData>> {
  const res = await fetch(`${API_ROOT_URL}/files/${fileName}/table?${params}`);
  const responseJSON = await res.json();
  return { data: parseAPITableData(responseJSON), pageNumber };
}

// used in numbers view.
// TODO: transform this data to have a better structure
async function getSegmentsData(fileName: string): Promise<ApiSegmentsData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/segments?page=0&co_occ=2000&folio=`
  );
  return await res.json();
}

// source text collections
// TODO: use for the text browser tree view
// export async function getSourceTextCollections(language: SourceLanguage) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/menus/sidebar/${language}`
//   );
//   const response = await res.json();
//
//   return response.result.map((collection: SourceTextCollectionApiData) => ({
//     // label: menuItem.search_field,
//     // id: menuItem.search_field,
//     // name: menuItem.displayName,
//     // textName: menuItem.textname,
//     // category: menuItem.category,
//   }));
// }

async function getParallelCount({
  fileName,
  params,
}: {
  fileName: string;
  params: string;
}): Promise<Record<string, number>> {
  const res = await fetch(
    `${API_ROOT_URL}/parallels/${fileName}/count?${params}`
  );

  return await res.json();
}

export async function getCategoryMenuData(
  language: SourceLanguage
): Promise<DatabaseCategory[]> {
  const res = await fetch(`${API_ROOT_URL}/menus/category/${language}`);
  const response = await res.json();

  return response.categoryitems.flat().map((item: ApiCategoryMenuData) => ({
    id: item.category,
    categoryName: item.category,
    name: item.categoryname,
  }));
}

async function getFolios(fileName: string): Promise<DatabaseFolio[]> {
  const res = await fetch(`${API_ROOT_URL}/files/${fileName}/folios`);

  const response = await res.json();

  return response.folios.map((folio: ApiFolioData) => ({
    id: folio.num,
    segmentNr: folio.segment_nr,
  }));
}

export const DbApi = {
  LanguageMenu: {
    makeQueryKey: (language: SourceLanguage) => ["languageMenuData", language],
    call: getLanguageMenuData,
  },
  CategoryMenu: {
    makeQueryKey: (language: SourceLanguage) => ["categoryMenuData", language],
    call: getCategoryMenuData,
  },
  SidebarSourceTexts: {
    makeQueryKey: (language: SourceLanguage) => ["textCollections", language],
    call: () => null,
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
  ParallelCount: {
    makeQueryKey: (fileName: string) => ["parallelCount", fileName],
    call: getParallelCount,
  },
  FolioData: {
    makeQueryKey: (fileName: string) => ["foliosData", fileName],
    call: getFolios,
  },
};
