import type { DbView } from "features/sidebar/settingComponents/DbViewSelector";

// import { API_ROOT_URL, RESULTS_DOWNLOAD_ROOT_URL } from "./constants";
import { API_ROOT_URL } from "./constants";

interface ApiDownloadProps {
  fileName: string;
  serializedParams: string;
  view: DbView;
}

const apiDownloadViews = ["numbers", "table"];

// example response: download/dn2_download.xlsx
export async function getParallelDownloadData({
  fileName,
  serializedParams,
  view,
}: ApiDownloadProps): Promise<{ url: string; name: string } | undefined> {
  if (!apiDownloadViews.includes(view)) {
    return;
  }

  const res = await fetch(
    `${API_ROOT_URL}/files/${fileName}/tabledownload?co_occ=2000&${serializedParams}&download_data=${view}`
  );
  const response = await res.json();

  // const url = `${RESULTS_DOWNLOAD_ROOT_URL}/${response}`;
  const url = `https://buddhanexus.net/${response}`;
  const name = `BuddhaNexus_${fileName}_${new Date()
    .toISOString()
    .split(".")[0]
    .replace(/T/, "_")
    .replace(/:/g, "-")}.xlsx`;

  return { url, name };
}
