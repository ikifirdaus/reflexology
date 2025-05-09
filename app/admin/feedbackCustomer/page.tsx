import { Suspense } from "react";
import FeedbackPage from "@/components/dashboard/pages/FeedbackPage";
import SkeletonAdminLayout from "@/components/dashboard/ui/Skeleton/SkeletonAdminLayout";

export default function Page() {
  return (
    <Suspense fallback={<SkeletonAdminLayout />}>
      <FeedbackPage />
    </Suspense>
  );
}
