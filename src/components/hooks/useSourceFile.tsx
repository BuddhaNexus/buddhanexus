import { useRouter } from "next/router";

export const useSourceFile = () => {
  const { query, isFallback } = useRouter();

  const sourceFile = query.file;

  return { sourceFile, isFallback };
};
