import * as React from "react";
import { useResultPageType } from "@components/hooks/useResultPageType";

import { DbFileButtons } from "./DbFileButtons";
import { QueryPageButtons } from "./QueryPageButtons";
import { QueryPageTopStackFrame } from "./QueryPageTopStackFrame";
import { SearchButtons } from "./SearchButtons";

export const QueryPageTopStack = ({ matches = 0 }: { matches?: number }) => {
  const { isSearchPage } = useResultPageType();

  if (isSearchPage) {
    return (
      <QueryPageTopStackFrame matches={matches}>
        <QueryPageButtons>
          <SearchButtons />
        </QueryPageButtons>
      </QueryPageTopStackFrame>
    );
  }

  return (
    <QueryPageTopStackFrame matches={matches}>
      <QueryPageButtons>
        <DbFileButtons />
      </QueryPageButtons>
    </QueryPageTopStackFrame>
  );
};
