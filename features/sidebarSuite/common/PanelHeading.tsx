import { Typography } from "@mui/material";

export default function PanelHeading({ heading }: { heading: string }) {
  return (
    <Typography variant="h6" component="h3" mb={2}>
      {heading}
    </Typography>
  );
}
