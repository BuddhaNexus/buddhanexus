import { Virtuoso } from "react-virtuoso";
import type { ApiTablePageData } from "types/api";

interface Props {
  data: ApiTablePageData;
}

export default function TableView({ data }: Props) {
  return (
    <Virtuoso
      totalCount={data.length}
      data={data}
      itemContent={(index, parallel) => <div>{JSON.stringify(parallel)}</div>}
    />
  );
}
