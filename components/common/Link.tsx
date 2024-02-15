import React, { FC, PropsWithChildren } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { LinkProps } from "@mui/material/Link";
import MUILink from "@mui/material/Link";

interface Props extends LinkProps {}

export const Link: FC<PropsWithChildren<Props>> = React.forwardRef(
  ({ href, children, ...rest }, ref) => {
    const { locale } = useRouter();

    return (
      <NextLink
        ref={ref}
        href={href ?? ""}
        locale={locale}
        passHref
        legacyBehavior
      >
        <MUILink href={href} {...rest}>
          {children}
        </MUILink>
      </NextLink>
    );
  },
);
Link.displayName = "Link";
