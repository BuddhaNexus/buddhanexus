import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

export default function CappedMatchesChip({
  label,
  message,
  matches,
}: {
  label: string;
  message: string;
  matches: number;
}) {
  return (
    <Tooltip
      id="matches-tooltip"
      title={<span style={{ fontSize: "1rem" }}>{message}</span>}
      placement="top-start"
      PopperProps={{ disablePortal: true }}
      sx={{ fontSize: "1rem" }}
    >
      <Chip
        size="small"
        label={
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>{label}</Box>
            <Box sx={{ fontSize: "1.25em", mt: "-3px", ml: "5px", mr: "2px" }}>
              {">"}
            </Box>
            <Box sx={{ minWidth: "2ch", textAlign: "center" }}>{matches}</Box>
          </Box>
        }
        sx={{ mx: 0.5, p: 0.5 }}
        aria-labelledby="matches-tooltip"
        role="status"
        tabIndex={0}
      />
    </Tooltip>
  );
}
