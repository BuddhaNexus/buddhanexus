import apiClient from "@api";
import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import { RESULTS_DOWNLOAD_ROOT_URL } from "@utils/api/constants";
import type {
  APITableViewDownloadRequestBody,
  APITableViewDownloadResponseData,
} from "@utils/api/types";

const parseAPITableDownloadData = (
  filePath: APITableViewDownloadResponseData,
  fileName: string,
) => {
  return {
    // example filePath: download/dn2_download.xlsx
    url: `${RESULTS_DOWNLOAD_ROOT_URL}/${filePath}`,
    // Creates a unique, timestamped file name to avoid overwriting existing files on the user's computer.
    name: `BuddhaNexus_${fileName}_${new Date()
      .toISOString()
      .replace(/\.\w+$/, "")
      .replace(/T/, "_")
      .replaceAll(":", "-")}.xlsx`,
  };
};

export type ParsedTableDownloadData = ReturnType<
  typeof parseAPITableDownloadData
>;

export async function getParallelDownloadData(
  body: APITableViewDownloadRequestBody,
) {
  // this triggers the creation of an excel sheet of the data for the current view (table & number only) for the user to download. The sheet is generated on the backend and lives in a folder on the HDD of the server for a while and gets removed after a few days.
  const { data: filePath } = await apiClient.POST("/table-view/download/", {
    body: parseAPIRequestBody(body),
  });

  if (!filePath) {
    throw new Error("Table View download file path is undefined");
  }

  return parseAPITableDownloadData(filePath, body.file_name);
}
