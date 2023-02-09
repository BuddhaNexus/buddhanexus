import { useParallels } from "@components/db/sidebar/filters";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

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
