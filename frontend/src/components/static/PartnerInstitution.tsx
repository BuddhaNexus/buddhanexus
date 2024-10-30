import Image from "next/image";
import { Box, Link, Paper, Typography } from "@mui/material";

interface Props {
  name?: string;
  href: string;
  alt: string;
  src: string;
}

function PartnerInstitution({ name, href, alt, src }: Props) {
  return (
    <Box
      component="figure"
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        mx: {
          xs: 1,
          sm: 2,
        },
      }}
    >
      <Typography variant="h5" component="figcaption" sx={{ mb: 2 }}>
        {name}
      </Typography>
      <Paper elevation={3}>
        <Link
          sx={{
            position: "relative",
            display: "block",
            height: {
              xs: "170px",
              sm: "300px",
            },
            width: "100%",
          }}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={src}
            alt={alt}
            fill={true}
            sizes="(max-width: 768px) calc(100vw - 112px), 600px"
            placeholder="blur"
          />
        </Link>
      </Paper>
      <br />
    </Box>
  );
}

export default PartnerInstitution;
