import { Virtuoso } from "react-virtuoso";
import { useParallels } from "@components/sidebar/context";
import { CircularProgress } from "@mui/material";

import { TableViewRow } from "./TableViewRow";

export default function ProtoFilteredTableView() {
  const { parallels, isLoading, isFetching } = useParallels();

  return (
    <>
      {isLoading || isFetching || !parallels ? (
        <CircularProgress color="inherit" />
      ) : (
        <div style={{ height: "70vh" }}>
          <Virtuoso
            totalCount={parallels.length}
            data={parallels}
            itemContent={(index, parallel) => (
              <TableViewRow parallel={parallel} />
            )}
          />
        </div>
      )}
    </>
  );
}
