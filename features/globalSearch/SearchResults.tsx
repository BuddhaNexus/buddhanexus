import { GridComponents, VirtuosoGrid } from "react-virtuoso";
// import { EmptyPlaceholder, Footer } from "@components/db/ListComponents";
import { styled } from "@mui/material/styles";

import { SearchResultItem } from "./SearchResultItem";
import { SearchResultSkeletonItem } from "./SearchResultSkeletonItem";

interface Props {
  data: any;
}

const ItemContainer = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flex: "none",
  alignContent: "stretch",
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    width: "calc(50% - 1rem)",
  },
  [theme.breakpoints.up("lg")]: {
    width: "calc(33% - 1rem)",
  },
}));

const ItemWrapper = styled("div")(({ theme }) => ({
  flex: "1",
  textAlign: "center",
  fontSize: "80%",
  border: `1px solid ${theme.palette.grey[200]}`,
  whiteSpace: "nowrap",
}));

const ListContainer = styled("ul")(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "1.5rem",
  paddingInline: "0",
})) as GridComponents["List"];

export default function SearchResults({ data }: Props) {
  return (
    <VirtuosoGrid
      totalCount={data.length}
      overscan={200}
      data={data}
      components={{
        Item: ItemContainer,
        List: ListContainer,
        ScrollSeekPlaceholder: () => {
          return (
            <ItemContainer>
              <ItemWrapper>
                <SearchResultSkeletonItem />
              </ItemWrapper>
            </ItemContainer>
          );
        },
      }}
      itemContent={(index, result) => <SearchResultItem result={result} />}
      scrollSeekConfiguration={{
        enter: (velocity) => Math.abs(velocity) > 1000,
        exit: (velocity) => Math.abs(velocity) < 100,
        // change: (_, range) => console.log({ range }),
      }}
    />
  );
}
