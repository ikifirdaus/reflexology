import { Suspense } from "react";
import SkeletonAdminLayout from "@/components/dashboard/ui/Skeleton/SkeletonAdminLayout";
import BranchPage from "@/components/dashboard/pages/BranchPage";

export default function Page() {
  return (
    <Suspense fallback={<SkeletonAdminLayout />}>
      <BranchPage />
    </Suspense>
  );
}
