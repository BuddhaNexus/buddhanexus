// graph view
// import apiClient from "@api";
// import type {
//   APIGraphViewRequestBody,
//   APIGraphViewResponseData,
// } from "utils/api/types";
import createClient from "openapi-fetch";
import type {
  ApiGraphPageData,
  FilePropApiQuery,
} from "utils/api/types/common";

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
