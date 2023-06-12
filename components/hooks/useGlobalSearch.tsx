import { useRouter } from "next/router";

export type InputKeyDown = React.KeyboardEvent<HTMLInputElement>;

type HandleOnSearchPress = (e: InputKeyDown, searchTerm: string) => void;

type HandleOnSearchClick = (searchTerm: string) => void;

interface GlobalSearchProps {
  handleOnSearchPress: HandleOnSearchPress;
  handleOnSearchClick: HandleOnSearchClick;
  searchParam: string;
}

export function useGlobalSearch(): GlobalSearchProps {
  const router = useRouter();
  const { push, query } = router;
  const { search_string, ...otherParams } = query;

  const searchParam = typeof search_string === "string" ? search_string : "";
  const pathname = "/search";

  const handleOnSearchPress: HandleOnSearchPress = async (e, searchTerm) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await push({
        pathname,
        query: { search_string: searchTerm, ...otherParams },
      });
    }
  };

  const handleOnSearchClick: HandleOnSearchClick = async (searchTerm) => {
    await push({
      pathname,
      query: { search_string: searchTerm, ...otherParams },
    });
  };

  return {
    handleOnSearchPress,
    handleOnSearchClick,
    searchParam,
  };
}
