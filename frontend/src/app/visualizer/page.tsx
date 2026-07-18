import { Suspense } from "react";
import { PageLoader } from "@/components/Feedback";
import { VisualizerClient } from "@/components/VisualizerClient";

export default function VisualizerPage() {
  return (
    <Suspense fallback={<PageLoader label="Đang mở phòng mô phỏng..." />}>
      <VisualizerClient />
    </Suspense>
  );
}
