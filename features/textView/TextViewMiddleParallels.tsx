import React from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { TextPageData } from "types/api/text";
import { useQueryParam } from "use-query-params";
import { DbApi } from "utils/api/dbApi";

interface Props {
  parallelIds: string[];
}

export default function TextViewMiddleParallels({ parallelIds }: Props) {
  const {
    // sourceLanguage, fileName, queryParams
  } = useDbQueryParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSegmentId, setSelectedSegmentId] =
    useQueryParam<string>("selectedSegment");

  const {
    // data, isInitialLoading, isError
  } = useQuery<TextPageData>({
    queryKey: DbApi.TextViewMiddle.makeQueryKey(parallelIds),
    queryFn: () =>
      DbApi.TextViewMiddle.call(["K01n742u:13423", "K01n742u:24812"]),
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <Tooltip
        title="Clear selected segment"
        PopperProps={{ disablePortal: true }}
      >
        <IconButton color="inherit" onClick={() => setSelectedSegmentId("")}>
          {/* todo: add i18n */}
          <HighlightOffIcon aria-label="clear selected segment" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
