import React from "react";
import Image from "next/image";
import { serifFontFamily } from "@components/theme";
import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import type { MDXComponents } from "mdx/types";

const ResponsiveImage = ({ alt, ...props }: any) => (
  <Image
    alt={alt}
    layout="responsive"
    width="100%"
    {...props}
    placeholder="blur"
  />
);

export const AppMDXComponents: MDXComponents = {
  img: ResponsiveImage,
  h1: ({ children }) => (
    <Typography variant="h2" component="h1">
      {children}
    </Typography>
  ),
  h2: ({ children }) => <Typography variant="h2">{children}</Typography>,
  h3: ({ children }) => <Typography variant="h3">{children}</Typography>,
  h4: ({ children }) => <Typography variant="h4">{children}</Typography>,
  h5: ({ children }) => <Typography variant="h5">{children}</Typography>,
  h6: ({ children }) => <Typography variant="h6">{children}</Typography>,
  body: ({ children }) => (
    <Typography variant="body1" sx={{ fontFamily: serifFontFamily }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body1" sx={{ my: 2, fontFamily: serifFontFamily }}>
      {children}
    </Typography>
  ),
  a: ({ children, href }) => <Link href={href}>{children}</Link>,
};
