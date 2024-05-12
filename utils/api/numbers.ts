import apiClient from "@api";
import type {
  FilePropApiQuery,
  InfiniteFilePropApiQuery,
  PagedResponse,
} from "types/api/common";

import { parseDbPageQueryParams } from "./utils";

export interface NumbersParallel {
  displayName: string;
  fileName: string;
  category: string;
  segmentnr: string;
}
export interface NumbersSegment {
  segmentnr: string;
  parallels: NumbersParallel[];
}

export type APINumbersData = NumbersSegment[];

type ExtendedPagedResponse<T> = PagedResponse<T> & {
  hasNextPage: boolean;
};

export type PagedAPINumbersData = ExtendedPagedResponse<APINumbersData>;

export async function getNumbersData({
  fileName,
  queryParams,
  pageNumber,
}: InfiniteFilePropApiQuery): Promise<PagedAPINumbersData> {
  // TODO:
  //    - remove type casting once response model is added to api
  const { data: res } = await apiClient.POST("/numbers-view/numbers/", {
    body: {
      file_name: fileName,
      score: 30,
      par_length: 30,
      sort_method: "position",
      ...parseDbPageQueryParams(queryParams),
      page: pageNumber,
    },
  });

  const data = res as APINumbersData;

  const hasNextPage = !(Object.keys(data).length < 100);
  return { data, pageNumber, hasNextPage };
}

export type APINumbersCategoriesData = {
  id: string;
  displayName: string;
}[];

export async function getNumbersViewCategories({
  fileName,
}: FilePropApiQuery): Promise<APINumbersCategoriesData> {
  // TODO:
  //    - remove type casting once response model is added to api
  const { data } = await apiClient.GET("/numbers-view/categories/", {
    params: { query: { file_name: fileName } },
  });

  return data as APINumbersCategoriesData;
}
