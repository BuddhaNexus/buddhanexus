import React from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { Box, Skeleton, TableCell, TableRow } from "@mui/material";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import type { NumbersViewData } from "@utils/api/endpoints/numbers-view/numbers";
import type { APIGetResponse, APIPostResponse } from "@utils/api/types";
import { DbLanguage } from "@utils/api/types";

import {
  createTableColumns,
  createTableRows,
  getVirtuosoTableComponents,
} from "./numbersViewTableContent";

export type NumbersSegment = APIPostResponse<"/numbers-view/numbers/">[number];

interface NumbersTableProps {
  categories: APIGetResponse<"/numbers-view/categories/">;
  data: APIPostResponse<"/numbers-view/numbers/">;
  hasNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<NumbersViewData, unknown>, Error>
  >;
  isFetching: boolean;
  isLoading: boolean;
  language: DbLanguage;
  fileName: string;
}

const stickyStyles = { position: "sticky", left: 0 };

export default function NumbersTable({
  categories,
  data,
  hasNextPage,
  fetchNextPage,
  isFetching,
  isLoading,
  language,
  fileName,
}: NumbersTableProps) {
  const loadMoreItems = React.useCallback(async () => {
    if (!isFetching && !isLoading) {
      await fetchNextPage();
    }
  }, [isFetching, fetchNextPage, isLoading]);

  const rowData = React.useMemo(() => createTableRows(data), [data]);

  const columns = React.useMemo<ColumnDef<NumbersSegment>[]>(
    () => createTableColumns({ categories, language, fileName }),
    [categories, language, fileName],
  );

  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const components = React.useMemo(
    () => getVirtuosoTableComponents() as TableComponents<any>,
    [],
  );

  const FixedHeaderContent = React.memo(() => {
    return table.getHeaderGroups().map((headerGroup) => (
      <TableRow
        key={headerGroup.id}
        sx={{ backgroundColor: "background.card", margin: 0 }}
      >
        {headerGroup.headers.map((header) => {
          const styles = {
            ...(header.column.getIsFirstColumn() && {
              ...stickyStyles,
              zIndex: 1,
              backgroundColor: "inherit",
              borderRight: "1px solid #e0e0e0",
            }),
          };
          return (
            <TableCell key={header.id} sx={styles}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
    ));
  });
  FixedHeaderContent.displayName = "FixedHeaderContent";

  const ItemContent: React.FC<{ index: number }> = React.memo(({ index }) => {
    const shouldLoadMore = index >= rows.length - 1 && hasNextPage;

    if (shouldLoadMore && !isFetching) {
      // eslint-disable-next-line no-void
      void loadMoreItems();
      return (
        <>
          {columns.map((column) => (
            <TableCell key={`skeleton-${index}-${JSON.stringify(column)}`}>
              <Skeleton />
            </TableCell>
          ))}
        </>
      );
    }
    ItemContent.displayName = "ItemContent";

    const row = rows[index] as Row<any>;

    return (
      <>
        {row?.getVisibleCells().map((cell, i) => {
          let height;
          const isSegmentId = cell.column.getIsFirstColumn();

          if (isSegmentId) {
            const contentLength = cell.getValue()?.toString().length ?? 0;
            // prettier-ignore
            height = contentLength > 30 ? "5rem" : (contentLength > 17 ? "3.6rem" : undefined);
          }

          return (
            <TableCell
              key={cell.id.concat(i.toString())}
              sx={{
                padding: "6px",
                ...(isSegmentId && {
                  ...stickyStyles,
                  backgroundColor: "background.paper",
                  borderRight: "1px solid #e0e0e0",
                  paddingLeft: "1rem",
                  overflowWrap: "anywhere",
                }),
                ...(height && { height }),
              }}
            >
              {isSegmentId ? (
                <Box sx={{ position: "absolute", top: 0, bottom: 0 }}>
                  <Box
                    sx={{
                      position: "sticky",
                      top: "54px",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                </Box>
              ) : (
                flexRender(cell.column.columnDef.cell, cell.getContext())
              )}
            </TableCell>
          );
        })}
      </>
    );
  });

  return (
    <div style={{ height: "100%" }}>
      <TableVirtuoso
        totalCount={data.length}
        components={components}
        itemContent={(index) => <ItemContent index={index} />}
        overscan={20}
        fixedHeaderContent={() => <FixedHeaderContent />}
      />
    </div>
  );
}
