import { useActiveSegmentParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { TextViewPane } from "@features/textView/TextViewPane";

export const TextViewLeftPane = () => {
  const [activeSegmentId] = useActiveSegmentParam();
  const { fileName } = useDbRouterParams();

  return (
    <TextViewPane
      activeSegmentId={activeSegmentId}
      fileName={fileName}
      isRightPane={false}
    />
  );
};
