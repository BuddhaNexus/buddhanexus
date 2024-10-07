import InactiveTreeHead, {
  InactiveTreeHeadProps,
} from "@components/db/SearchableDbSourceTree/treeComponents/InactiveTreeHead";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export function LoadingTree(props: InactiveTreeHeadProps) {
  return (
    <>
      <InactiveTreeHead {...props} />

      <Box sx={{ mt: 10 }}>
        {[6, 4, 3, 5, 4].map((n, i) => (
          <Box
            key={`tree-skeleton-${i}`}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              maxWidth: `${n * 10}%`,
            }}
          >
            <ChevronRightIcon sx={{ mr: 1 }} />
            <Skeleton
              sx={{
                flexGrow: 1,
                animationDuration: `4s`,
                "&::after": { animationDuration: `2.${n}s` },
              }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
