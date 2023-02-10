import { Virtuoso } from "react-virtuoso";
import type { TablePageData } from "types/api/table";

import { TableViewRow } from "./TableViewRow";

interface Props {
  data: TablePageData;
}

export default function TableView({ data }: Props) {
  return (
    <Virtuoso
      totalCount={data.length}
      data={data}
      itemContent={(index, parallel) => <TableViewRow parallel={parallel} />}
    />
  );
}
