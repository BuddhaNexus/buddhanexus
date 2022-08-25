import { Box, styled } from "@mui/system";

interface Props {
  year: string;
  children: string;
  yearWidth: string;
}

export const projectWidth = "100";

const StyledBox = styled(Box)({ "& p": { marginTop: 0 } });

function Event({
  year,
  children,
  yearWidth = "50",
}: React.PropsWithChildren<Props>) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ minWidth: `${yearWidth}px` }}>{year}</Box>
      <StyledBox>{children}</StyledBox>
    </Box>
  );
}

export default Event;
