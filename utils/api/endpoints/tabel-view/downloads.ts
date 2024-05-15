import apiClient from "@api";
import { RESULTS_DOWNLOAD_ROOT_URL } from "utils/api/constants";
import type { FilePropApiQuery } from "utils/api/types/common";
import { parseDbPageQueryParams } from "utils/api/utils";

// TODO: Awaiting api endpoint fix - remove eslint-disable-line on completion

export async function getParallelDownloadData({
  fileName,
  queryParams,
}: FilePropApiQuery): Promise<{ url: string; name: string } | undefined> {
  // this triggers the creation of an excel sheet of the data for the current view (table & number only) for the user to download. The sheet is generated on the backend and lives in a folder on the HDD of the server for a while and gets removed after a few days.

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const path = await apiClient.POST("/table-view/download/", {
    body: {
      file_name: fileName,
      ...parseDbPageQueryParams(queryParams),
      download_data: "",
    },
  });

  // example path: download/dn2_download.xlsx
  const url = `${RESULTS_DOWNLOAD_ROOT_URL}/`;
  // const url = `${RESULTS_DOWNLOAD_ROOT_URL}/${path}`;

  // Creates a unique, timestamped file name to avoid overwriting existing files on the user's computer.
  const name = `BuddhaNexus_${fileName}_${new Date()
    .toISOString()
    .replace(/\.\w+$/, "")
    .replace(/T/, "_")
    .replaceAll(":", "-")}.xlsx`;

  return { url, name };
}
