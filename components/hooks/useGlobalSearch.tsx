import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
// import { searchPageFilter } from "features/sidebarSuite/config/settings";

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

      const query: Record<string, string> = {
        [uniqueSettings.queryParams.searchString]: searchTerm,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(router.query).forEach(([key, value]) => {
        // This resets query values if the search has been initiated from a source text results page. The source language setting.persists.
        // TODO: enable when `global-search` is merged and remove eslint-disable-next-line
        // if (value && Object.keys(searchPageFilter).includes(key)) {
        //   query[key] = value.toString();
        // }
      });

      await router.push({
        pathname: "/search",
        query,
      });
    }
  };

  return {
    handleOnSearch,
    searchParam: params.get(uniqueSettings.queryParams.searchString) ?? "",
  };
}
