import { NextSeo } from "next-seo";
import { currentDbViewAtom } from "@atoms";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue } from "jotai";
import startCase from "lodash/startCase";

export const DbViewPageHead = () => {
  const { fileName } = useDbRouterParams();

  const { data: displayName, isLoading } = useQuery({
    queryKey: DbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () => DbApi.TextDisplayName.call({ segmentnr: fileName }),
  });

  const dbView = useAtomValue(currentDbViewAtom);

  const title = fileName?.toUpperCase();

  const subtitle = isLoading ? "..." : (displayName ?? "");

  return (
    <>
      <NextSeo
        title={`BuddhaNexus | ${fileName} :: ${
          displayName ? `${displayName} ::` : ""
        } ${startCase(dbView)} View`}
      />

      <QueryPageTopStack title={title} subtitle={subtitle} />
    </>
  );
};
