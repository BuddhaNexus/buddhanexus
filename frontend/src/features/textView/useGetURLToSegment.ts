import { useRouter } from "next/router";
import { DbLanguage } from "@utils/api/types";

export const useGetURLToSegment = ({
  segmentNumber,
  language,
}: {
  segmentNumber: string;
  language: DbLanguage;
}) => {
  const { basePath } = useRouter();

  // Example: ["dn1:1.1.1_0", "dn1:1.1.2_0"] -> ["dn1", "1.1.1_0"]
  const [fileName] = segmentNumber.split(":");

  const urlToSegment = `${basePath}/db/${language}/${fileName}/text?active_segment=${segmentNumber}&active_segment_index=0`;

  return { urlToSegment };
};
