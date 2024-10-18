import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import {
  allUIComponentParamNames,
  searchRequestFilters,
} from "@features/sidebarSuite/uiSettingsLists";

export type InputKeyDown = React.KeyboardEvent<HTMLInputElement>;

type HandleSearchActionProps = {
  searchTerm: string;
  event?: InputKeyDown;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
type HandleSearchAction = (props: HandleSearchActionProps) => void;

interface GlobalSearchProps {
  handleSearchAction: HandleSearchAction;
  searchParam: string;
}

export function useGlobalSearch(): GlobalSearchProps {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  const handleSearchAction: HandleSearchAction = async (props) => {
    const { searchTerm, event, setIsOpen } = props;

    if (!event || event.key === "Enter") {
      event?.preventDefault();

      const query: Record<string, string> = {
        [allUIComponentParamNames.search_string]: searchTerm,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(router.query).forEach(([key, value]) => {
        // This resets query values if the search has been initiated from a source text results page. The source language setting.persists.
        if (value && searchRequestFilters.some((item) => item === key)) {
          query[key] = value.toString();
        }
      });

      await router.push({
        pathname: "/search",
        query,
      });
    }

    if (event?.key === "Escape" && setIsOpen) {
      setIsOpen((prev) => !prev);
    }
  };

  return {
    handleSearchAction,
    searchParam: params.get(allUIComponentParamNames.search_string) ?? "",
  };
}
