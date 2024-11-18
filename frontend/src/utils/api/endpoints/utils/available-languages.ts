// import apiClient from "@api";
// import type { APIGetRequestQuery, APIGetResponse } from "@utils/api/types";
// import { getValidDbLanguage } from "@utils/validators";

// const parseAPIAvailableLanguagesData = (
//   data: APIGetResponse<"/utils/languages/">
// ) => {
//   return data
//     ? data.langList.map((lang) => getValidDbLanguage(lang)).filter(Boolean)
//     : [];
// };

// export async function getAvailableLanguages(
//   query: APIGetRequestQuery<"/utils/languages/">
// ) {
//   if (!query.filename) {
//     return [];
//   }

//   const { data } = await apiClient.GET("", {
//     params: { query },
//   });

//   return data ? parseAPIAvailableLanguagesData(data) : [];
// }

export async function getAvailableLanguages() {}
