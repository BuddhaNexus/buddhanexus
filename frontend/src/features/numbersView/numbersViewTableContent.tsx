import React from "react";
import { TableComponents } from "react-virtuoso";
import { Link } from "@components/common/Link";
import { createURLToSegment } from "@features/textView/utils";
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
}

export const createTableColumns = ({
  categories,
  language,
}: CreateTableColumnProps): ColumnDef<NumbersSegment>[] => [
  {
    accessorKey: "segment",
    header: () => (
      <div
        style={{
          // sets width for whole column
          minWidth: "150px",
        }}
      >
        <Typography textTransform="uppercase">segment</Typography>
      </div>
    ),
    cell: (info) => {
      const segmentnr = info.getValue<string>();
      return (
        <Typography sx={{ fontWeight: 500, lineHeight: 1.25 }}>
          <Link
            href={createURLToSegment({ segmentNumber: segmentnr, language })}
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
            const { displayName, segmentnr } = parallel || {};

            const segmentNumber = segmentnr.split("–")[0] ?? segmentnr;

            const urlToSegment = createURLToSegment({
              segmentNumber,
              language,
            });

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
                <Typography sx={{ lineHeight: 1.25 }}>
                  <Link href={urlToSegment} color="text.primary">
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
