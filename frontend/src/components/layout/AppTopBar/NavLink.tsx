import { Link } from "@components/common/Link";

interface NavLinkProps {
  title: string;
  href: string;
}

export const NavLink = ({ title, href }: NavLinkProps) => (
  <Link
    variant="button"
    color={{ sm: "primary.contrastText" }}
    href={href}
    underline="hover"
    sx={{ my: 1, mx: 1.5 }}
  >
    {title}
  </Link>
);
