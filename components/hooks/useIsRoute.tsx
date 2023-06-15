import { useRouter } from "next/router";

type Route = "atii" | "home" | "search" | "table";
type Test = { route: Route; pattern: string };
type Tests = Test[];
type HandleRouteChange = Partial<Record<Route, boolean>>;

export function useIsRoute(tests: Tests): HandleRouteChange {
  const router = useRouter();

  return tests.reduce((isRouteObject, item) => {
    const { route, pattern } = item;
    const isPath = new RegExp(pattern).test(router.route);

    return { ...isRouteObject, [route]: isPath };
  }, {});
}
