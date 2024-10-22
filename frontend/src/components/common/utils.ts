import { DbLanguage } from "@utils/api/types";
import type { DbViewEnum } from "@utils/constants";

export const getTextPath = ({
  dbLanguage,
  fileName,
  dbView,
}: {
  fileName?: string;
  dbLanguage: DbLanguage | undefined;
  dbView: DbViewEnum;
}) => {
  return `/db/${dbLanguage}/${fileName}/${dbView}`;
};
