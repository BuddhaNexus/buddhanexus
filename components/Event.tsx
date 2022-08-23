import { Box } from "@mui/system";

interface Props {
  year: string;
  children: string;
  yearWidth: string;
}

export const projectWidth = "100";

function Event({
  year,
  children,
  yearWidth = "50",
}: React.PropsWithChildren<Props>) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ minWidth: `${yearWidth}px` }}>{year}</Box>
      <Box>{children}</Box>
    </Box>
  );
}

export default Event;
