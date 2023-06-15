// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//  @ts-nocheck
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";

export type InputKeyDown = React.KeyboardEvent<HTMLInputElement>;

type HandleOnSearch = (searchTerm: string, e?: InputKeyDown) => void;

interface GlobalSearchProps {
  handleOnSearch: HandleOnSearch;
  searchParam: string;
}

export function useGlobalSearch(): GlobalSearchProps {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settingsList } = useDbQueryParams();

  // TODO: there is an error with NextJS's searchParams type (the docs say this should be valid, https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams), see if upgrading fixes it, or cast.
  const params = new URLSearchParams(searchParams);

  const pathname = "/search";

  const handleOnSearch: HandleOnSearch = async (searchTerm, e?) => {
    if (!e || e.key === "Enter") {
      e?.preventDefault();
      params.set(settingsList.queryParams.searchString, searchTerm);
      params.delete("file");

      await router.push({
        pathname,
        query: params.toString(),
      });
    }
  };

  return {
    handleOnSearch,
    searchParam: params.get(settingsList.queryParams.searchString) ?? "",
  };
}
