import InactiveTreeHead, {
  InactiveTreeHeadProps,
} from "@components/db/SearchableDbSourceTree/treeComponents/InactiveTreeHead";
import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export function LoadingTree(props: InactiveTreeHeadProps) {
  return (
    <>
      <InactiveTreeHead {...props} />

      <Box
        sx={{
          width: "100%",
          height: "calc(100% - 4.25rem)", // offset for InactiveTreeHead
          mt: 2,
          overflow: "clip",
        }}
      >
        {[6, 4, 3, 5, 4, 5, 2, 7, 4, 3, 2, 5, 4, 7, 3, 6].map((n, i) => (
          <Box
            key={`tree-skeleton-${i}`}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              maxWidth: `${n * 10}%`,
            }}
          >
            <Skeleton
              sx={{
                flexGrow: 1,
                animationDuration: `4s`,
                "&::after": { animationDuration: `2.${n}s` },
                ml: 2,
              }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
