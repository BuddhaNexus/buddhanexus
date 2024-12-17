import { Virtuoso } from "react-virtuoso";
import NoSearchResultsFound from "@features/globalSearch/NoSearchResultsFound";
import { ParsedSearchResult } from "@utils/api/endpoints/search";

import { SearchResultsRow } from "./SearchResultsRow";

interface Props {
  data: ParsedSearchResult[][];
}

export default function SearchResults({ data }: Props) {
  if (data.length === 0) {
    return <NoSearchResultsFound />;
  }

  return (
    <Virtuoso
      totalCount={data.length}
      data={data}
      itemContent={(index, rowItems) => (
        <SearchResultsRow rowItems={rowItems} row={index} />
      )}
      overscan={20}
      components={{
        Footer: () => <div style={{ paddingBottom: "20px" }} />,
      }}
    />
  );
}
