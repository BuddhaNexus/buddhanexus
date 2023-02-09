import { Virtuoso } from "react-virtuoso";
import { useParallels } from "@components/db/sidebar/filters";
import { CircularProgress } from "@mui/material";

// import type { TablePageData } from "types/api/table";
import { TableViewRow } from "./TableViewRow";

// interface Props {
//   data: TablePageData;
// }

export default function TableView() {
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
