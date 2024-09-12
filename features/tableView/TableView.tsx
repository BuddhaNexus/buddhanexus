import { Virtuoso } from "react-virtuoso";
import {
  EmptyPlaceholder,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import type { ParsedTableViewData } from "utils/api/endpoints/table-view/table";

import { TableViewRow } from "./TableViewRow";

interface Props {
  data: ParsedTableViewData;
  onEndReached: () => void;
  onStartReached: () => void;
}

export default function TableView({
  data,
  onEndReached,
  onStartReached,
}: Props) {
  const hasData = data.length > 0;
  // we have to pass `undefined` here to display the EmptyPlaceholder.
  return (
    <Virtuoso
      totalCount={data.length}
      data={hasData ? data : undefined}
      itemContent={(index, parallel) => <TableViewRow parallel={parallel} />}
      endReached={onEndReached}
      startReached={onStartReached}
      overscan={20}
      components={{
        Footer: hasData ? ListLoadingIndicator : undefined,
        EmptyPlaceholder,
      }}
    />
  );
}
