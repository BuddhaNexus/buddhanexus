import type { DbViewEnum } from "features/sidebarSuite/config/types";
import type { SourceLanguage } from "utils/constants";

export const getTextPath = ({
  sourceLanguage,
  fileName,
  dbView,
}: {
  fileName?: string;
  sourceLanguage: SourceLanguage;
  dbView: DbViewEnum;
}) => {
  return `/db/${sourceLanguage}/${fileName}/${dbView}`;
};
