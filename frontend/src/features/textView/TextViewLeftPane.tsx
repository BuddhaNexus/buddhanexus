import { useActiveSegmentParam } from "@components/hooks/params";
import { TextViewPane } from "@features/textView/TextViewPane";

export const TextViewLeftPane = () => {
  const [activeSegmentId] = useActiveSegmentParam();

  return <TextViewPane activeSegmentId={activeSegmentId} isRightPane={false} />;
};
