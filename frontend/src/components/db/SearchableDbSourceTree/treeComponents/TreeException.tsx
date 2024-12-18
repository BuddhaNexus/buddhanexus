import InactiveTreeHead, {
  InactiveTreeHeadProps,
} from "@components/db/SearchableDbSourceTree/treeComponents/InactiveTreeHead";
import { Box, Typography } from "@mui/material";

type TreeExceptionProps = {
  message: string;
  height: number;
  width: number;
} & InactiveTreeHeadProps;

export function TreeException(props: TreeExceptionProps) {
  return (
    <Box sx={{ width: props.width, height: props.height }}>
      <InactiveTreeHead {...props} />

      <Typography sx={{ m: 2 }} color="error.main">
        Error: {props.message}
      </Typography>
    </Box>
  );
}
