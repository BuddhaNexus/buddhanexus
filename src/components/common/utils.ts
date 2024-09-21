import type { DbViewEnum } from "@components/hooks/useDbView";
import type { SourceLanguage } from "@utils/constants";

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
