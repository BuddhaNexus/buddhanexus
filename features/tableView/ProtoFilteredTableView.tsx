import { Virtuoso } from "react-virtuoso";
import { Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useParallels } from "features/sidebar/context";

import { TableViewRow } from "./TableViewRow";

interface Props {
  onEndReached: () => void;
  onStartReached: () => void;
}

const Footer = () => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography>Loading...</Typography>
    </div>
  );
};

export default function ProtoFilteredTableView({
  onEndReached,
  onStartReached,
}: Props) {
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
            endReached={onEndReached}
            startReached={onStartReached}
            overscan={20}
            components={{ Footer }}
          />
        </div>
      )}
    </>
  );
}
