import apiClient from "@api";
import type {
  APIGraphViewRequestBody,
  APIGraphViewResponseData,
} from "utils/api/types";

export type GraphPageGraphData = [name: string, count: number][];

const defaultReturnValue = {
  histogramgraphdata: [],
  piegraphdata: [],
};

function parseAPIGraphData(data: APIGraphViewResponseData) {
  return data
    ? Object.entries(data).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value.map((item) => {
            return [item[0], Number(item[1])];
          }) as GraphPageGraphData,
        };
      }, defaultReturnValue)
    : defaultReturnValue;
}

export async function getGraphData(body: APIGraphViewRequestBody) {
  const { data } = await apiClient.POST("/graph-view/", {
    body,
  });

  return data ? parseAPIGraphData(data) : defaultReturnValue;
}
