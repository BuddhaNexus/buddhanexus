import { QueryPageTopStack } from "@components/db/QueryPageTopStack";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Typography } from "@mui/material";

export const DbViewPageHead = () => {
  // TODO: get full text name
  const { fileName } = useDbQueryParams();

  return (
    <>
      <QueryPageTopStack />

      <Typography variant="h2" component="h1">
        {fileName.toUpperCase()}
      </Typography>
      <SourceTextSearchInput />
    </>
  );
};
