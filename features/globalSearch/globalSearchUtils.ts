import type { useRouter } from "next/router";

interface HandleEnterPressProps {
  e: React.KeyboardEvent<HTMLInputElement>;
  searchTerm: string;
  router: ReturnType<typeof useRouter>;
}

export const handleSearchInputEnterPress = async ({
  e,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchTerm,
  router,
}: HandleEnterPressProps) => {
  // TODO: update with `/search?q=${searchTerm}` when available from endpoint
  if (e.key === "Enter") {
    e.preventDefault();
    await router.push(`/search`);
  }
};
