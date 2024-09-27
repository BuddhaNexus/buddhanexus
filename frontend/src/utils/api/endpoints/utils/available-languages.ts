import apiClient from "@api";
import type {
  APIAvailableLanguagesRequestQuery,
  APIAvailableLanguagesResponseData,
} from "@utils/api/types";
import { SourceLanguage } from "@utils/constants";

const parseAPIAvailableLanguagesData = (
  data: APIAvailableLanguagesResponseData,
) => {
  return data
    ? data.langList.map((lang) => lang as SourceLanguage).filter(Boolean)
    : [];
};

export async function getAvailableLanguages(
  query: APIAvailableLanguagesRequestQuery,
) {
  if (!query.file_name) {
    return [];
  }

  const { data } = await apiClient.GET("/utils/available-languages/", {
    params: { query },
  });

  return data ? parseAPIAvailableLanguagesData(data) : [];
}
