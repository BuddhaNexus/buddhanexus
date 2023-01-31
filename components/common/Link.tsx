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
  href: h,
  route,
  children,
  ...rest
}) => {
  const { locale } = useRouter();

  const href = route ? routes[route][locale as SupportedLocale] : h;

  return (
    <NextLink href={href ?? ""} locale={locale} passHref legacyBehavior>
      <MUILink href={href} {...rest}>
        {children}
      </MUILink>
    </NextLink>
  );
};
