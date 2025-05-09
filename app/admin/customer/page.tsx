import { Suspense } from "react";
import CustomerPage from "@/components/dashboard/pages/CustomerPage";
import SkeletonAdminLayout from "@/components/dashboard/ui/Skeleton/SkeletonAdminLayout";

export default function Page() {
  return (
    <Suspense fallback={<SkeletonAdminLayout />}>
      <CustomerPage />
    </Suspense>
  );
}
