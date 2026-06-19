import { Suspense } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import TrackOrderContent from "./TrackOrderContent";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TrackOrderContent />
    </Suspense>
  );
}
