import { NextSeo } from "next-seo";
import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { startCase } from "lodash";
import { OldDbApi } from "utils/api/dbApi";

export const DbViewPageHead = () => {
  const { fileName } = useDbQueryParams();

  // TODO: the current implementation uses an endpoint from the old API, we should switch to the new one when available
  const { data: displayName, isLoading } = useQuery({
    queryKey: OldDbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () => OldDbApi.TextDisplayName.call(fileName),
  });

  const dbView = useAtomValue(currentViewAtom);

  return (
    <>
      <NextSeo
        title={`BuddhaNexus — ${fileName} :: ${displayName} :: ${startCase(
          dbView,
        )} View`}
      />
      <QueryPageTopStack />
      {isLoading ? (
        <Typography variant="h2" component="h1" mb={1}>
          {fileName?.toUpperCase()}
        </Typography>
      ) : (
        <Typography variant="h2" component="h1" mb={1}>
          {fileName?.toUpperCase()}: {displayName}
        </Typography>
      )}

    </>
  );
};
