import { NextSeo } from "next-seo";
import { currentDbFileAtom, currentDbViewAtom } from "@atoms";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue } from "jotai";
import startCase from "lodash/startCase";

export const DbViewPageHead = () => {
  const currentDbFile = useAtomValue(currentDbFileAtom);
  const { fileName } = useDbRouterParams();

  // Used for external navigation to app when titles can't be retrieved from menudata
  const { data, isLoading } = useQuery({
    queryKey: DbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () =>
      DbApi.TextDisplayName.call({
        segmentnr: fileName,
      }),
    enabled: !currentDbFile,
  });

  const dbView = useAtomValue(currentDbViewAtom);

  let title = currentDbFile?.name;

  if (!title) {
    title = isLoading ? "..." : (data?.displayName ?? "");
  }

  const displayId = currentDbFile?.displayId ?? data?.displayId ?? "";

  return (
    <>
      <NextSeo
        title={`BuddhaNexus | ${displayId} :: ${title} ${startCase(dbView)} View`}
      />

      <QueryPageTopStack title={title} subtitle={displayId} />
    </>
  );
};
