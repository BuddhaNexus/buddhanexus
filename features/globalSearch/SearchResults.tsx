import { Virtuoso } from "react-virtuoso";

import { SearchResultsRow } from "./SearchResultsRow";

interface Props {
  data: any;
}

export default function SearchResults({ data }: Props) {
  return (
    <Virtuoso
      totalCount={data.length}
      data={data}
      itemContent={(index, rowItems) => (
        <SearchResultsRow rowItems={rowItems} />
      )}
      overscan={20}
    />
  );
}
