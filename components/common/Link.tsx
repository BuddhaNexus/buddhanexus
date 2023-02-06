import type { FC, PropsWithChildren } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { LinkProps } from "@mui/material/Link";
import MUILink from "@mui/material/Link";
import { routes } from "routes-i18n";
import type { SupportedLocale } from "types/i18next";

type ConditionalProps =
  | {
      href: string;
      route?: never;
    }
  | {
      href?: never;
      route: string;
    };

interface BaseProps extends LinkProps {}

type Props = BaseProps & ConditionalProps;

export const Link: FC<PropsWithChildren<Props>> = ({
  href,
  route,
  children,
  ...rest
}) => {
  const { locale } = useRouter();

  const routeKey = route?.replace(/^\//, "");

  const resolvedHref = routeKey
    ? routes[routeKey][locale as SupportedLocale]
    : href;

  return (
    <NextLink href={resolvedHref ?? ""} locale={locale} passHref legacyBehavior>
      <MUILink href={resolvedHref} {...rest}>
        {children}
      </MUILink>
    </NextLink>
  );
};
