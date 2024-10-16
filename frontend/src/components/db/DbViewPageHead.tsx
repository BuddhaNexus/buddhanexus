import { NextSeo } from "next-seo";
import { currentDbViewAtom } from "@atoms";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue } from "jotai";
import { startCase } from "lodash";

export const DbViewPageHead = () => {
  const { fileName } = useDbRouterParams();

  const { data: displayName, isLoading } = useQuery({
    queryKey: DbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () => DbApi.TextDisplayName.call({ segmentnr: fileName }),
  });

  const dbView = useAtomValue(currentDbViewAtom);

  return (
    <>
      <NextSeo
        title={`BuddhaNexus — ${fileName} :: ${
          displayName ? `${displayName} ::` : ""
        } ${startCase(dbView)} View`}
      />

      <QueryPageTopStack />

      {isLoading ? (
        <Typography variant="h2" component="h1" mb={1}>
          {fileName?.toUpperCase()}
        </Typography>
      ) : (
        <Typography variant="h2" component="h1" mb={1}>
          {fileName?.toUpperCase()}
          {displayName ? `: ${displayName}` : ""}
        </Typography>
      )}
    </>
  );
};
