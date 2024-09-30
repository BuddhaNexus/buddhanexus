import InactiveTreeHead, {
  type InactiveTreeHeadProps,
} from "@components/db/SearchableDbSourceTree/treeComponents/InactiveTreeHead";
import { Typography } from "@mui/material";

type TreeExceptionProps = {
  message: string;
} & InactiveTreeHeadProps;

export function TreeException(props: TreeExceptionProps) {
  return (
    <>
      <InactiveTreeHead {...props} />

      <Typography sx={{ mt: 4 }} color="error.main">
        {props.message}
      </Typography>
    </>
  );
}
