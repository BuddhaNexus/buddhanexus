import { useTranslation } from "next-i18next";
import { Typography } from "@mui/material";
import { DbLanguage } from "@utils/api/types";

type HeadingProps = {
  isRendered: boolean;
  dbLanguage: DbLanguage;
};

export function TreeHeading({ isRendered, dbLanguage }: HeadingProps) {
  const { t } = useTranslation("common");
  if (!isRendered) return null;

  const languageName = t(`language.${dbLanguage}`);
  return (
    <Typography variant="h5" component="h2" sx={{ px: 2, pt: 2 }}>
      {t("textBrowser.mainPrompt", { languageName })}
    </Typography>
  );
}
