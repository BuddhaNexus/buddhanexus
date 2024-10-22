import { useRouter } from "next/router";

export type ResultPageType = "dbFile" | "search" | undefined;

const dbFilePattern = new RegExp("^/db/(.*?)/");

export const useResultPageType = () => {
  const router = useRouter();

  const isSearchPage = router.route.startsWith("/search");
  const isDbFilePage = dbFilePattern.test(router.route);

  let resultPageType: ResultPageType;

  if (isSearchPage) {
    resultPageType = "search";
  }

  if (isDbFilePage) {
    resultPageType = "dbFile";
  }

  return {
    isSearchPage,
    isDbFilePage,
    resultPageType,
  };
};
