import { DbLanguage } from "@utils/api/types";
import createClient from "openapi-fetch";
import type { paths } from "src/codegen/api/v2";

// temporary. replace with same API url as the rest of the endpoints when BE is ready
const API_ROOT = "https://buddhanexus.kc-tbts.uni-hamburg.de/api";

const { GET, POST } = createClient<paths>({ baseUrl: API_ROOT });

interface APIVisualCollection {
  collectionkey: string;
  collectionlanguage: string;
  collectionname: string;
}

export interface ParsedApiVisualCollection {
  key: string;
  language: string;
  name: string;
}

const getLegacyLanguageCode = (languageCode: DbLanguage): string => {
  switch (languageCode) {
    case "bo": {
      return "tib";
    }
    case "sa": {
      return "skt";
    }
    case "pa": {
      return "pli";
    }
    case "zh": {
      return "chn";
    }
    default: {
      return "skt";
    }
  }
};

const parseVisualCollection = (
  collections: APIVisualCollection[],
): ParsedApiVisualCollection[] =>
  collections.map((c) => ({
    key: c.collectionkey,
    name: c.collectionname,
    language: c.collectionlanguage,
  }));

export async function getVisualViewCollections(language: DbLanguage) {
  // @ts-expect-error we have to call the legacy BE API here
  const { data } = await GET(`/collections`);

  // @ts-expect-error no typings, leaving this intentionally since it's temporary
  return parseVisualCollection(data?.result as APIVisualCollection[]).filter(
    (c) => c.language === getLegacyLanguageCode(language),
  );
}
