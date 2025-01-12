import {
  graphDataRemoveLowest,
  paginateGraphData,
} from "@features/visualView/graphDataUtils";
import { DbLanguage } from "@utils/api/types";
import createClient from "openapi-fetch";
import type { paths } from "src/codegen/api/v2";

// temporary. replace with same API url as the rest of the endpoints when BE is ready
const API_ROOT = "https://buddhanexus.kc-tbts.uni-hamburg.de/api";

const { GET } = createClient<paths>({ baseUrl: API_ROOT });

interface APIV1VisualCollection {
  collectionkey: string;
  collectionlanguage: string;
  collectionname: string;
}

export interface ParsedApiV1VisualCollection {
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
  collections: APIV1VisualCollection[],
): ParsedApiV1VisualCollection[] =>
  collections.map((c) => ({
    key: c.collectionkey,
    name: c.collectionname,
    language: c.collectionlanguage,
  }));

export async function getVisualViewCollections(language: DbLanguage) {
  // @ts-expect-error we have to call the legacy BE API here
  const { data } = await GET(`/collections`);

  // @ts-expect-error no typings, leaving this intentionally since it's temporary
  return parseVisualCollection(data?.result as APIV1VisualCollection[]).filter(
    (c) => c.language === getLegacyLanguageCode(language),
  );
}

const VISUAL_VIEW_PAGE_SIZE = 30;

export async function getVisualGraphData(
  language: DbLanguage,
  inquiryCollection: string,
  hitCollections: string[],
) {
  // @ts-expect-error we have to call the legacy BE API here
  const { data } = await GET(`/visual/${inquiryCollection}`, {
    params: {
      query: {
        language: getLegacyLanguageCode(language),
        selected: hitCollections,
      },
    },
  });

  // code to handle legacy BN API
  // https://github.com/BuddhaNexus/buddhanexus-frontend/blob/master/src/views/visual/visual-view-graph.js#L126
  const [initialGraphData] = paginateGraphData(
    // @ts-expect-error legacy api, no typings available
    data?.graphdata,
    VISUAL_VIEW_PAGE_SIZE,
  );
  const filteredData = graphDataRemoveLowest(initialGraphData);
  const totalPages = initialGraphData?.length ?? 0;

  return { filteredData, totalPages };
}
