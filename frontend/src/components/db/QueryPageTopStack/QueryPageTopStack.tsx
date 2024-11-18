import * as React from "react";
import { useResultPageType } from "@components/hooks/useResultPageType";

import { DbFileButtons } from "./DbFileButtons";
import { QueryPageButtons } from "./QueryPageButtons";
import { QueryPageTopStackFrame } from "./QueryPageTopStackFrame";
import { SearchButtons } from "./SearchButtons";

export const QueryPageTopStack = ({ matches = 0 }: { matches?: number }) => {
  const { isSearchPage } = useResultPageType();

  return (
    <QueryPageTopStackFrame matches={matches}>
      <QueryPageButtons>
        {isSearchPage ? <SearchButtons /> : <DbFileButtons />}
      </QueryPageButtons>
    </QueryPageTopStackFrame>
  );
};
