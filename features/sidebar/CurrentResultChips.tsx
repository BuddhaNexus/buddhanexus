import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useParallels } from "features/sidebar/context";

export default function CurrentResultChips() {
  const { parallels } = useParallels();

  return (
    <Box>
      <Chip
        size="small"
        label={`Parallels: ${parallels.length}`}
        sx={{ mx: 0.5, p: 0.5 }}
      />
      <Chip size="small" label="Filters: 1" sx={{ mx: 0.5, p: 0.5 }} />
    </Box>
  );
}
