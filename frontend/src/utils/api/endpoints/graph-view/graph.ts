import apiClient from "@api";
import type { APIPostRequestBody, APIPostResponse } from "@utils/api/types";

type GraphDataEntry = [name: string, count: number];
export type GraphPageGraphData = GraphDataEntry[];

const defaultReturnValue = {
  histogramgraphdata: null,
  piegraphdata: null,
};

function parseAPIGraphData(data: APIPostResponse<"/graph-view/"> | undefined): {
  histogramgraphdata: GraphPageGraphData | null;
  piegraphdata: GraphPageGraphData | null;
} {
  return data
    ? Object.entries(data).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: Array.isArray(value)
            ? value.map((item) => {
                return [item[0], Number(item[1])];
              })
            : null,
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
