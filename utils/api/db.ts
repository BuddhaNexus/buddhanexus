import type { DatabaseText } from "@components/db/types";
import type {
  ApiGraphPageData,
  ApiLanguageMenuData,
  ApiSegmentsData,
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
    rootOffsetFromStart: p.root_offset_beg,
    coOccurrences: p["co-occ"],
    fileName: p.file_name,
    paragraphLength: p.par_length,
    paragraphOffsetFromEnd: p.par_offset_end,
    paragraphOffsetFromStart: p.par_offset_beg,
    paragraphPositionFromStart: p.par_pos_beg,
    paragraphSegmentNumbers: p.par_segnr,
    paragraphSegmentText: p.par_segment,
    rootLength: p.root_length,
    rootOffsetFromEnd: p.root_offset_end,
    rootSegmentNumber: p.root_segnr,
    rootSegmentText: p.root_seg_text,
    score: p.score,
  }));
}

async function getTableData(fileName: string): Promise<TablePageData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/table?co_occ=2000&sort_method=position`
  );
  const responseJSON = await res.json();
  return parseAPITableData(responseJSON);
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

export const DbApi = {
  LanguageMenu: {
    makeQueryKey: (language: SourceLanguage) => ["languageMenuData", language],
    call: getLanguageMenuData,
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
};
