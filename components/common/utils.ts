import type { SourceLanguage } from "utils/constants";

export const getTableViewUrl = ({
  sourceLanguage,
  fileName,
}: {
  fileName?: string;
  sourceLanguage: SourceLanguage;
}) => `/db/${sourceLanguage}/${fileName}/table`;
