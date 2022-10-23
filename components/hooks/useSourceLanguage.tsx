import { useRouter } from "next/router";

export const useSourceLanguage = () => {
  const {
    query: { language },
  } = useRouter();

  return language;
};
