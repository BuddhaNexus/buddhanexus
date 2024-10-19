import type { components, operations, paths } from "src/codegen/api/proto.ts";

// TODO: most endpoint query functions have a `if undefined` check, this is to match a temp fix for BE data issues. The check should be cleared onee Pali data is updated on the BE.

/**
 * *********** !!! ***********
 * CODEGEN DERIVATE TYPES / CREATOR TYPE HELPERS  ONLY
 * Requests & responses mirror paths given in the `operations`
 * interface in `src/codegen/api/*.ts`
 * Sub-components taken directly from `components` interface
 * ************************** ¡¡¡ **************************
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type HasPostMethod<T> = T extends { post: any } ? true : false;

type FilterPostEndpoints<T> = {
  [K in keyof T]: HasPostMethod<T[K]> extends true ? K : never;
}[keyof T];

type FilterGetEndpoints<T> = {
  [K in keyof T]: HasPostMethod<T[K]> extends false ? K : never;
}[keyof T];

export type APISchemas = components["schemas"];
export type Endpoint = keyof paths;
export type DbLanguage = Exclude<APISchemas["Languages"], "all">;

/**
 * *********************
 * CREATOR TYPE HELPERS
 * **************************
 */

type PostEndpoint = FilterPostEndpoints<paths>;
type GetEndpoint = FilterGetEndpoints<paths>;

type RequestBody<operation> = "requestBody" extends keyof operation
  ? "content" extends keyof operation["requestBody"]
    ? "application/json" extends keyof operation["requestBody"]["content"]
      ? operation["requestBody"]["content"]["application/json"]
      : never
    : never
  : never;

type RequestQuery<operation> = "parameters" extends keyof operation
  ? "query" extends keyof operation["parameters"]
    ? operation["parameters"]["query"]
    : never
  : never;

type APIResponse<operation> = "responses" extends keyof operation
  ? 200 extends keyof operation["responses"]
    ? "content" extends keyof operation["responses"][200]
      ? "application/json" extends keyof operation["responses"][200]["content"]
        ? operation["responses"][200]["content"]["application/json"]
        : never
      : never
    : never
  : never;

export type APIPostRequestBody<Endpoint extends PostEndpoint> = RequestBody<
  paths[Endpoint]["post"]
>;

export type APIPostResponse<Endpoint extends PostEndpoint> = APIResponse<
  paths[Endpoint]["post"]
>;

export type APIGetRequestQuery<Endpoint extends GetEndpoint> = RequestQuery<
  paths[Endpoint]["get"]
>;

export type APIGetResponse<Endpoint extends GetEndpoint> = APIResponse<
  paths[Endpoint]["get"]
>;

/**
 * *********************
 * REQUEST PROP HELPERS
 * **************************
 */

type RequestBodyProps = {
  [K in keyof operations]: operations[K] extends {
    requestBody: { content: { "application/json": infer U } };
  }
    ? U
    : never;
}[keyof operations] extends infer U
  ? (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I
    : never
  : never;

type QueryParameterProps = {
  [K in keyof operations]: operations[K] extends {
    parameters: { query: infer U };
  }
    ? U
    : never;
}[keyof operations] extends infer U
  ? (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I
    : never
  : never;

export type AllAPIRequestProps = RequestBodyProps & QueryParameterProps;

export type APIRequestPropName = keyof AllAPIRequestProps;
