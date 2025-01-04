import { DbLanguage } from "@utils/api/types";

export const useGetURLToSegment = ({
  segmentNumber,
  language,
}: {
  segmentNumber: string;
  language: DbLanguage;
}) => {
  // Example: ["dn1:1.1.1_0", "dn1:1.1.2_0"] -> ["dn1", "1.1.1_0"]
  const [fileName] = segmentNumber.split(":");

  const urlToSegment = `/db/${language}/${fileName}/text?active_segment=${segmentNumber}&active_segment_index=0`;

  return { urlToSegment };
};
