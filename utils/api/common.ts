// used in numbers view.
// TODO: transform this data to have a better structure
import type { ApiSegmentsData } from "types/api/common";
import type { SourceLanguage } from "utils/constants";

import { API_ROOT_URL } from "./constants";

export async function getSegmentsData(
  fileName: string
): Promise<ApiSegmentsData> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/segments?page=0&co_occ=2000&folio=`
  );
  return await res.json();
}

export async function getCategoryMenuData(language: SourceLanguage) {
  const res = await fetch(`${API_ROOT_URL}/menus/category/${language}`);
  const response = await res.json();

  return response.categoryitems.flat().map(
    (item: { category: string; categoryname: string }) =>
      ({
        id: item.category,
        categoryName: item.category,
        name: item.categoryname,
      } as const)
  );
}

export async function getParallelCount({
  fileName,
  serializedParams,
}: {
  fileName: string;
  serializedParams: string;
}) {
  const res = await fetch(
    `${API_ROOT_URL}/parallels/${fileName}/count?${serializedParams}`
  );

  return await res.json();
}

export async function getFolios(fileName: string) {
  const res = await fetch(`${API_ROOT_URL}/files/${fileName}/folios`);

  const response = await res.json();

  return response.folios.map(
    (folio: { segment_nr: string; num: string }) =>
      ({
        id: folio.num,
        segmentNr: folio.segment_nr,
      } as const)
  );
}
