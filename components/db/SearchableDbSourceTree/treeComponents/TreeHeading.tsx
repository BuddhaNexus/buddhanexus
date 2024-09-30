import { useTranslation } from "next-i18next";
import { Typography } from "@mui/material";
import { SourceLanguage } from "utils/constants";

type HeadingProps = {
  isRendered: boolean;
  sourceLanguage: SourceLanguage;
};

export function TreeHeading({ isRendered, sourceLanguage }: HeadingProps) {
  const { t } = useTranslation("common");
  if (!isRendered) return null;

  const languageName = t(`language.${sourceLanguage}`);
  return (
    <Typography variant="h5" component="h2" sx={{ px: 2, py: 2 }}>
      {t("textBrowser.mainPrompt", { languageName })}
    </Typography>
  );
}
