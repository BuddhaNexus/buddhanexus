import { Virtuoso } from "react-virtuoso";
import { useTranslation } from "next-i18next";
import { Typography } from "@mui/material";
import type { TablePageData } from "types/api/table";

import { TableViewRow } from "./TableViewRow";

interface Props {
  data: TablePageData;
  onEndReached: () => void;
  onStartReached: () => void;
}

const Footer = () => {
  const { t } = useTranslation("common");

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography>{t("prompts.loading")}</Typography>
    </div>
  );
};

export default function TableView({
  data,
  onEndReached,
  onStartReached,
}: Props) {
  return (
    <Virtuoso
      totalCount={data.length}
      data={data}
      itemContent={(index, parallel) => <TableViewRow parallel={parallel} />}
      endReached={onEndReached}
      startReached={onStartReached}
      overscan={20}
      components={{ Footer }}
    />
  );
}
