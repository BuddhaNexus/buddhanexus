import { type SxProps, Typography } from "@mui/material";

export default function PanelHeading({
  heading,
  sx,
}: {
  heading: string;
  sx?: SxProps;
}) {
  return (
    <Typography variant="h6" component="h2" sx={sx}>
      {heading}
    </Typography>
  );
}
