import React from "react";
import { TableComponents } from "react-virtuoso";
import { Link } from "@components/common/Link";
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type {
  APIGetResponse,
  APIPostResponse,
  APISchemas,
} from "@utils/api/types";
import { DbLanguage } from "@utils/api/types";

import type { NumbersSegment } from "./NumbersTable";

export const createTableRows = (
  rowData: APIPostResponse<"/numbers-view/numbers/">,
) =>
  rowData.map((item) => {
    const row: any = { segment: item.segmentnr };

    item.parallels.forEach((parallel) => {
      // TODO: - clear undefined check onee Pali data is updated to BE.
      if (!parallel.category) return;

      const prevCategoryValue = row[parallel.category] || [];
      Object.assign(row, {
        [parallel.category]: [...prevCategoryValue, parallel],
      });
    });

    return row;
  });

interface CreateTableColumnProps {
  categories: APIGetResponse<"/numbers-view/categories/">;
  language: DbLanguage;
  fileName: string;
}
export const createTableColumns = ({
  categories,
  language,
  fileName,
}: CreateTableColumnProps): ColumnDef<NumbersSegment>[] => [
  {
    accessorKey: "segment",
    header: () => (
      <div
        style={{
          width: "150px",
        }}
      >
        <Typography textTransform="uppercase">segment</Typography>
      </div>
    ),
    cell: (info) => {
      const segmentnr = info.getValue<string>();
      return (
        <Typography sx={{ fontWeight: 500 }}>
          <Link
            // TODO: make sure this links to the correct segment
            href={`/db/${language}/${fileName}/text?selectedSegment=${segmentnr}`}
            target="_blank"
            rel="noreferrer noopenner"
          >
            {segmentnr}
          </Link>
        </Typography>
      );
    },
  },
  ...categories.map((header) => ({
    accessorKey: header.id,
    header: () => (
      <div
        style={{
          width: "200px",
          paddingLeft: "6px",
        }}
      >
        <Typography textTransform="uppercase">{header.id}</Typography>
      </div>
    ),
    cell: (info: CellContext<NumbersSegment, unknown>) => {
      const parallels = info?.getValue<APISchemas["Parallel"][]>() || [];
      return (
        <div
          style={{
            width: "200px",
            paddingLeft: "1rem",
          }}
        >
          {parallels.map((parallel, i) => {
            const {
              displayName,
              fileName: parallelFileName,
              segmentnr,
            } = parallel || {};

            return (
              <Tooltip
                key={[info.cell.id, segmentnr, i].join("-")}
                title={displayName}
                PopperProps={{
                  disablePortal: true,
                }}
                placement="top"
                enterDelay={1200}
              >
                <Typography>
                  <Link
                    // TODO: make sure this links to the correct segment
                    href={`/db/${language}/${parallelFileName}/text?selectedSegment=${segmentnr}`}
                    color="text.primary"
                    target="_blank"
                    rel="noreferrer noopenner"
                  >
                    {segmentnr}
                  </Link>
                </Typography>
              </Tooltip>
            );
          })}
        </div>
      );
    },
  })),
];

const ScrollerRef = React.forwardRef<HTMLDivElement>(
  function ScrollerRef(props, ref) {
    return <TableContainer component={Paper} {...props} ref={ref} />;
  },
);
const TableHeadRef = React.forwardRef<HTMLTableSectionElement>(
  function TableHeadRef(props, ref) {
    return <TableHead {...props} ref={ref} sx={{ zIndex: "2 !important" }} />;
  },
);

const TableBodyRef = React.forwardRef<HTMLTableSectionElement>(
  function TableBodyRef(props, ref) {
    return <TableBody {...props} ref={ref} />;
  },
);

export const getVirtuosoTableComponents = (): TableComponents => ({
  Scroller: ScrollerRef,
  Table: (props) => (
    <Table
      {...props}
      size="small"
      sx={{
        borderCollapse: "separate",
        "& tr:first-of-type > th:last-of-type, td:last-of-type": {
          paddingRight: 3,
        },
      }}
    />
  ),
  TableHead: TableHeadRef,
  TableRow,
  TableBody: TableBodyRef,
  ScrollSeekPlaceholder: ({ height }) => (
    <TableRow
      sx={{
        height,
      }}
    >
      <TableCell colSpan={100} sx={{ paddingX: 3, paddingY: 0 }}>
        <Skeleton height={15} />
      </TableCell>
    </TableRow>
  ),
});
