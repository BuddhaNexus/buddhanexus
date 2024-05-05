import React from "react";
import { styled } from "@mui/material/styles";
import type { SearchResult } from "utils/api/search";

import { SearchResultItem } from "./SearchResultItem";

interface Props {
  row: number;
  rowItems: SearchResult[];
}

const ListContainer = styled("div")(({ theme }) => ({
  paddingInline: "0",
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(3),
  marginBlock: theme.spacing(3),
}));

const DummyFillerItem = styled("div")(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    width: "31%",
  },
  wordBreak: "break-all",
}));

export const SearchResultsRow = ({ row, rowItems }: Props) => {
  /* search results data is grouped into 3-item arrays in `pages/search/index.tsx`. This is a workaround to simulate the `VituosoGrid` component which can't be used due to its inability to handle vairable item heights (see: https://virtuoso.dev/troubleshooting). Creating rows with a stable height fixes the jumping behaviour, allowing a grid layout for better desktop UX. 
  
  In cases where the number of items in the last row is less than 3, the row is filled with dummy items so that flex items are evenly distributed.  
  */

  const rowFillerCount = rowItems.length === 3 ? 0 : 3 - rowItems.length;

  return (
    <ListContainer>
      {rowItems.map((result, index) => (
        <SearchResultItem
          key={`row${row}-item${index}-${result.segmentNumber}`}
          result={result}
        />
      ))}
      {rowFillerCount === 0
        ? null
        : [...String(rowFillerCount)].map((dummyItem) => (
            <DummyFillerItem key={dummyItem} aria-hidden />
          ))}
    </ListContainer>
  );
};
