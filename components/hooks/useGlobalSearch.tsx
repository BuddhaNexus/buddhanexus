import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { getQueryParamsFromRouter } from "features/sidebarSuite/common/dbSidebarHelpers";

export type InputKeyDown = React.KeyboardEvent<HTMLInputElement>;

type HandleOnSearch = (searchTerm: string, e?: InputKeyDown) => void;

interface GlobalSearchProps {
  handleOnSearch: HandleOnSearch;
  searchParam: string;
}

export function useGlobalSearch(): GlobalSearchProps {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { uniqueSettings } = useDbQueryParams();

  const params = new URLSearchParams(searchParams);

  const handleOnSearch: HandleOnSearch = async (searchTerm, e?) => {
    if (!e || e.key === "Enter") {
      e?.preventDefault();

      const queryParams = getQueryParamsFromRouter({
        route: router.route,
        params,
      });
      // const queryParams = params
      queryParams.set(uniqueSettings.queryParams.searchString, searchTerm);

      await router.push({
        pathname: "/search",
        query: Object.fromEntries(queryParams.entries()),
      });
    }
  };

  return {
    handleOnSearch,
    searchParam: params.get(uniqueSettings.queryParams.searchString) ?? "",
  };
}
