// graph view
// import apiClient from "@api";
// import type {
//   APIGraphViewRequestBody,
//   APIGraphViewResponseData,
// } from "utils/api/types";
import createClient from "openapi-fetch";

export interface FilePropApiQuery {
  fileName: string;
  queryParams: any;
}

export type GraphPageGraphData = [name: string, count: number][];

export interface ApiGraphPageData {
  histogramgraphdata: GraphPageGraphData;
  piegraphdata: GraphPageGraphData;
}

// TODO: move to new BE once the endpoint is ready there
const OLD_BE_GRAPH_VIEW_ENDPOINT =
  "https://buddhanexus.kc-tbts.uni-hamburg.de/api/files";

export async function getGraphData({
  fileName,
  // queryParams,
}: FilePropApiQuery): Promise<ApiGraphPageData> {
  const apiClient = createClient({ baseUrl: OLD_BE_GRAPH_VIEW_ENDPOINT });

  const { data } = await apiClient.GET(
    // @ts-expect-error typings don't include the old BE
    `/${fileName}/graph?co_occ=2000`,
    {},
  );

  // TODO: - remove type casting once response model is added to api
  return data as unknown as ApiGraphPageData;
}
