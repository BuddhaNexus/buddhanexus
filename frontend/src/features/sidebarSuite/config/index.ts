import { DbViewEnum, SourceLanguage } from "@utils/constants";


export const DEFAULT_QUERY_PARAMS_VALUES = {
  score: 30,
  // par_length is given a dummy value of 25 (lowest value applicable to all languages). The true value is initated in useDbRouterParams hook when src lang value is available.
  par_length: 25,
  folio: undefined,
  sort_method: undefined,
  limits: undefined,
  target_collection: undefined,
  // multi_lingual is initialized at point of use with prefetched data (see `useQuery` fetch in `CurrentResultChips`).
  multi_lingual: undefined,
  language: undefined,
  search_string: undefined,
};

export const MIN_PAR_LENGTH_VALUES: Record<SourceLanguage, number> = {
  chn: 5,
  pli: 25,
  skt: 25,
  tib: 7,
};
export const DEFAULT_PAR_LENGTH_VALUES: Record<SourceLanguage, number> = {
  chn: 7,
  pli: 30,
  skt: 30,
  tib: 14,
};
