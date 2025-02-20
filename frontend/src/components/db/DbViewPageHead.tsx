import { NextSeo } from "next-seo";
import { currentDbViewAtom } from "@atoms";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { useMenuDataFileMap } from "@components/hooks/useMenuDataMap";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue } from "jotai";
import startCase from "lodash/startCase";

export const DbViewPageHead = () => {
  const menuDataFileMap = useMenuDataFileMap();
  const { fileName } = useDbPageRouterParams();
  const fileData = menuDataFileMap[fileName];

  // Used for external navigation to app when titles can't be retrieved from menudata
  const { data, isLoading } = useQuery({
    queryKey: DbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () =>
      DbApi.TextDisplayName.call({
        segmentnr: fileName,
      }),
    enabled: !fileData,
  });

  const dbView = useAtomValue(currentDbViewAtom);

  let title = fileData?.name;

  if (!title) {
    title = isLoading ? "..." : (data?.displayName ?? "");
  }

  const displayId = fileData?.displayId ?? data?.displayId ?? fileName;

  return (
    <>
      <NextSeo
        title={`BuddhaNexus | ${displayId} :: ${title} ${startCase(dbView)} View`}
      />

      <QueryPageTopStack title={title} subtitle={displayId} />
    </>
  );
};
