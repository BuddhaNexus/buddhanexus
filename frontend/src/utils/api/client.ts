import createClient from "openapi-fetch";
import type { paths } from "src/codegen/api/v2";

import { API_ROOT_URL } from "./constants";

const { GET, POST } = createClient<paths>({ baseUrl: API_ROOT_URL });

const apiClient = {
  GET,
  POST,
};

export default apiClient;
