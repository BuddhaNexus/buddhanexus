import { useResultPageType } from "@components/hooks/useResultPageType";

import DbFilePrimaryUISettings from "./DbFilePrimaryUISettings";
import SearchPrimaryUISettings from "./SearchPrimaryUISettings";

export const PrimaryUISettings = () => {
  const { isSearchPage, isDbFilePage } = useResultPageType();

  if (isDbFilePage) {
    return <DbFilePrimaryUISettings />;
  }

  if (isSearchPage) {
    return <SearchPrimaryUISettings />;
  }

  return null;
};
