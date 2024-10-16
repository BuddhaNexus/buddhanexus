import apiClient from "@api";
import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";

const parseFolioData = (data: APIGetResponse<"/utils/folios/">) => {
  return data.folios.map((folio) => {
    const { segment_nr, num } = folio as {
      segment_nr: string;
      num: string;
      REMOVE_CASTING_WHEN_BACKEND_FIXED: string;
    };

    return {
      segmentNr: segment_nr,
      number: num,
    };
  });
};

export type ParsedFolio = ReturnType<typeof parseFolioData>[number];

export async function getFolios(query: APIGetRequestQuery<"/utils/folios/">) {
  const { data } = await apiClient.GET("/utils/folios/", {
    params: { query },
  });

  return data ? parseFolioData(data) : [];
}
