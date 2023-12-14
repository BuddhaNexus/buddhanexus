import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { OldDbApi } from "utils/api/dbApi";

export const DbViewPageHead = () => {
  // TODO: get full text name
  const { fileName } = useDbQueryParams();

  const { data: displayName, isLoading } = useQuery({
    queryKey: OldDbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () => OldDbApi.TextDisplayName.call(fileName),
  });

  return (
    <>
      <QueryPageTopStack />
      {isLoading ? (
        <Typography variant="h2" component="h1" mb={1}>
          {fileName.toUpperCase()}
        </Typography>
      ) : (
        <Typography variant="h2" component="h1" mb={1}>
          {fileName.toUpperCase()}: {displayName}
        </Typography>
      )}
    </>
  );
};
