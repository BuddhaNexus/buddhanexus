import { Virtuoso } from "react-virtuoso";
import { Box, Typography } from "@mui/material";
import type { TablePageData, TablePageParallel } from "types/api/table";

interface Props {
  data: TablePageData;
}

const TableViewRow = ({ parallel }: { parallel: TablePageParallel }) => (
  <Box sx={{ py: 2 }}>
    <Typography sx={{}}>{JSON.stringify(parallel)}</Typography>
  </Box>
);

export default function TableView({ data }: Props) {
  return (
    <Virtuoso
      totalCount={data.length}
      data={data}
      itemContent={(index, parallel) => <TableViewRow parallel={parallel} />}
    />
  );
}
