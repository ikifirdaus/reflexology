import { Suspense } from "react";
import TherapistPage from "@/components/dashboard/pages/TherapistPage";
import SkeletonAdminLayout from "@/components/dashboard/ui/Skeleton/SkeletonAdminLayout";

export default function Page() {
  return (
    <Suspense fallback={<SkeletonAdminLayout />}>
      <TherapistPage />
    </Suspense>
  );
}
