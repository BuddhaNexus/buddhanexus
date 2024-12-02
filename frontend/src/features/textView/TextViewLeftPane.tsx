import {
  useActiveSegmentIndexParam,
  useActiveSegmentParam,
} from "@components/hooks/params";
import { TextViewPane } from "@features/textView/TextViewPane";

export const TextViewLeftPane = () => {
  const [activeSegmentId, setActiveSegmentId] = useActiveSegmentParam();
  const [activeSegmentIndex, setActiveSegmentIndex] =
    useActiveSegmentIndexParam();

  return (
    <TextViewPane
      activeSegmentId={activeSegmentId}
      setActiveSegmentId={setActiveSegmentId}
      activeSegmentIndex={activeSegmentIndex}
      setActiveSegmentIndex={setActiveSegmentIndex}
      isRightPane={false}
    />
  );
};
