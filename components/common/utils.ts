import type { DbView } from "features/sidebar/settingComponents/DbViewSelector";
import type { SourceLanguage } from "utils/constants";

export const getTextPath = ({
  sourceLanguage,
  fileName,
  dbView,
}: {
  fileName?: string;
  sourceLanguage: SourceLanguage;
  dbView: DbView;
}) => {
  return `/db/${sourceLanguage}/${fileName}/${dbView}`;
};
