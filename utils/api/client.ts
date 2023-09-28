import createClient from "openapi-fetch";
import { paths } from "codegen/api/v2";
import { API_ROOT_URL } from "./constants";

const { GET, POST } = createClient<paths>({ baseUrl: API_ROOT_URL });

const apiClient = {
  GET,
  POST,
};

export default apiClient;
