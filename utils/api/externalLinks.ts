import { API_ROOT_URL } from "./constants";

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
): Promise<ApiExternalLinkData> {
  const res = await fetch(
    `${API_ROOT_URL}/links/external/?file_name=${fileName}`
  );
  const response = await res.json();

  return response;
}
