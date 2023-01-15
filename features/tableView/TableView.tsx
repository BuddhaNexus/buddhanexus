import { Virtuoso } from "react-virtuoso";
import { Box, Stack, Typography } from "@mui/material";
import type { TablePageData, TablePageParallel } from "types/api/table";

interface Props {
  data: TablePageData;
}

const TableViewRow = ({ parallel }: { parallel: TablePageParallel }) => (
  <Stack direction="row" spacing={2} sx={{ py: 2 }}>
    <Typography sx={{ wordBreak: "break-all" }}>
      {JSON.stringify(parallel)}
    </Typography>
    <Box sx={{ width: 100, height: 100, background: "red" }}>Hello world!</Box>
  </Stack>
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
