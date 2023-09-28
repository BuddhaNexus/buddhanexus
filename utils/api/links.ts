import apiClient from "@api";

interface ApiExternalLinkData {
  bdrc: string | false;
  rkts: string | false;
  gretil: string | false;
  dsbc: string | false;
  cbeta: string | false;
  suttacentral: string | false;
  cbc: string | false;
  vri: string | false;
}

export async function getExternalLinksData(
  fileName: string
  // TODO: - add segmentnr prop
): Promise<ApiExternalLinkData> {
  const { data } = await apiClient.GET("/links/external/", {
    params: { query: { file_name: fileName, segmentnr: "dn3:0.2_0" } },
  });

  // TODO: - remove type casting once response model is added to api
  return (data as ApiExternalLinkData) ?? {};
}
