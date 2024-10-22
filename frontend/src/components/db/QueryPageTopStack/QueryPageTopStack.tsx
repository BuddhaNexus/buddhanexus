import * as React from "react";
import { useResultPageType } from "@components/hooks/useResultPageType";

import { ButtonsRenderer } from "./ButtonsRenderer";
import { DbFileButtons } from "./DbFileButtons";
import { QueryPageTopStackFrame } from "./QueryPageTopStackFrame";
import { SearchButtons } from "./SearchButtons";

export const QueryPageTopStack = ({ matches = 0 }: { matches?: number }) => {
  const { isSearchPage } = useResultPageType();

  if (isSearchPage) {
    return (
      <QueryPageTopStackFrame matches={matches}>
        <ButtonsRenderer>
          <SearchButtons />
        </ButtonsRenderer>
      </QueryPageTopStackFrame>
    );
  }

  return (
    <QueryPageTopStackFrame matches={matches}>
      <ButtonsRenderer>
        <DbFileButtons />
      </ButtonsRenderer>
    </QueryPageTopStackFrame>
  );
};
