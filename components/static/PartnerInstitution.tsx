import Image from "next/image";
import { Link, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

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
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h5" component="figcaption" sx={{ mb: 2 }}>
        {name}
      </Typography>
      <Paper elevation={3}>
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {/* <Image src={src} alt={alt} fill={true} placeholder="blur" /> */}
          <Image src={src} alt={alt} width={500} height={340} />
        </Link>
      </Paper>
      <br />
    </Box>
  );
}

export default PartnerInstitution;
