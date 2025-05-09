import { Suspense } from "react";
import TreatmentPage from "@/components/dashboard/pages/TreatmentPage";
import SkeletonAdminLayout from "@/components/dashboard/ui/Skeleton/SkeletonAdminLayout";

export default function Page() {
  return (
    <Suspense fallback={<SkeletonAdminLayout />}>
      <TreatmentPage />
    </Suspense>
  );
}
