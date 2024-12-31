import { parseAPIRequestBody } from "@utils/api/apiQueryUtils";
import type { APIPostRequestBody } from "@utils/api/types";

export async function getParallelDownloadData(
  body: APIPostRequestBody<"/download/">
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    // this triggers the creation of spreadsheet data for the current page, settings and view (table & number only). The backend returns a BytesIO object for download.
    const response = await fetch("https://dharmamitra.org/api-db/download/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parseAPIRequestBody(body)),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        error: new Error(
          `HTTP ${response.status} error! ${response.statusText}`
        ),
        blob: null,
      };
    }

    const blob = await response.blob();

    return { blob, error: null };
  } catch (e) {
    return { error: new Error(`Failed to fetch data: ${e}`), blob: null };
  }
}
