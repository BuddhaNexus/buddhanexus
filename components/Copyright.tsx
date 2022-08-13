import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      <Link color="inherit" href="https://www.aai.uni-hamburg.de/en.html">
        Universität Hamburg
      </Link>
      {", "}
      {new Date().getFullYear()}
    </Typography>
  );
}
