import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDbQueryParams } from "@components/hooks//useDbQueryParams";
import { StringParam, useQueryParam } from "use-query-params";

type Route = "atii" | "home" | "search" | "table";
type Test = { route: Route; pattern: string };
type Tests = Test[];
type HandleRouteChange = Partial<Record<Route, boolean>>;

export const routePatterns = {
  home: "^/$",
  atii: "^/atii",
  search: "^/search",
  table: "^/db/([^/]+?/){2}table",
};

export function useHandleRouteChange(tests: Tests): HandleRouteChange {
  const router = useRouter();
  const handleRouteChange = useRef<HandleRouteChange>({});

  const { settingsList } = useDbQueryParams();
  const [, setSortParam] = useQueryParam(
    settingsList.queryParams.sortMethod,
    StringParam
  );
  const [, setFileParam] = useQueryParam("file", StringParam);

  useEffect(() => {
    if (!router.isReady) return;

    const callbacks = {
      home: (isPath: boolean) => {
        return isPath;
      },
      atii: (isPath: boolean) => {
        return isPath;
      },
      table: (isPath: boolean) => {
        if (!isPath) {
          setSortParam(undefined);
        }
        return isPath;
      },
      search: (isPath: boolean) => {
        if (isPath) {
          setFileParam(undefined);
        }
        return isPath;
      },
    };

    handleRouteChange.current = tests.reduce((hookReturn, item) => {
      const { route, pattern } = item;
      const isPath = callbacks[route](new RegExp(pattern).test(router.route));

      return { ...hookReturn, [route]: isPath };
    }, {});
  }, [router.isReady, router.route, setFileParam, setSortParam, tests]);

  return handleRouteChange.current;
}
