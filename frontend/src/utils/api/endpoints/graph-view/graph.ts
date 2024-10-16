import apiClient from "@api";
import type { APIPostRequestBody, APIPostResponse } from "@utils/api/types";

export type GraphPageGraphData = [name: string, count: number][];

const defaultReturnValue = {
  histogramgraphdata: [],
  piegraphdata: [],
};

function parseAPIGraphData(data: APIPostResponse<"/graph-view/"> | undefined) {
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

export async function getGraphData(body: APIPostRequestBody<"/graph-view/">) {
  const { data } = await apiClient.POST("/graph-view/", {
    body,
  });

  return parseAPIGraphData(data);
}
