import {
  type ReadonlyURLSearchParams,
  useSearchParams as useTypeErrorSearchParams,
} from "next/navigation";

interface UseSearchParamsResult extends ReadonlyURLSearchParams {
  size: number;
}

/**
 * This is a temporary workaround for a bug in Next JS's `ReadonlyURLSearchParams` type, tracked in
 * {@link https://github.com/vercel/next.js/issues/49245|NextJS issue #49245}.
 * It enables the use of the `useSearchParam` hook as defined in the
 * {@link [docs](https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams)}.
 *
 * @return {UseSearchParamsResult} The result of calling the Next JS (correctly typed) `useSearchParams` hook.
 */
export function useSearchParams() {
  return useTypeErrorSearchParams() as UseSearchParamsResult;
}
