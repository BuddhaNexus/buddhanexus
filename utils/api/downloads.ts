import type { DbViewEnum } from "@components/hooks/useDbView";

import { API_ROOT_URL, RESULTS_DOWNLOAD_ROOT_URL } from "./constants";

interface ApiDownloadProps {
  fileName: string;
  serializedParams: string;
  view: DbViewEnum;
}

export async function getParallelDownloadData({
  fileName,
  serializedParams,
  view,
}: ApiDownloadProps): Promise<{ url: string; name: string } | undefined> {
  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/tabledownload?co_occ=2000&${serializedParams}&download_data=${view}`
  );

  // example response: download/dn2_download.xlsx
  const response = await res.json();

  const url = `${RESULTS_DOWNLOAD_ROOT_URL}/${response}`;
  // Creates a unique, timestamped file name to avoid overwriting existing files on the user's computer.
  const name = `BuddhaNexus_${fileName}_${new Date()
    .toISOString()
    .split(".")[0]
    .replace(/T/, "_")
    .replace(/:/g, "-")}.xlsx`;

  return { url, name };
}
