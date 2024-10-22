import { exhaustiveStringTuple } from "@utils/helpers";

import { DbLanguage } from "./types";

export const API_ROOT_URL = process.env.NEXT_PUBLIC_API_URL;
export const RESULTS_DOWNLOAD_ROOT_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL;
export const SEARCH_RESULTS_LIMIT = 200;
export const BD_RESULTS_LIMIT = 15000;

// The backend is the source of truth for DB language definition and DbLanguage is treated as a reliable backend "constant"
export const dbLanguages = exhaustiveStringTuple<DbLanguage>()(
  "pa",
  "sa",
  "bo",
  "zh",
);

export { type DbLanguage } from "./types";
