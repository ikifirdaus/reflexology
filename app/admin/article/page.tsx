import { Suspense } from "react";
import ArticlePage from "@/components/dashboard/pages/ArticlePage";
import SkeletonAdminLayout from "@/components/dashboard/ui/Skeleton/SkeletonAdminLayout";

export default function Page() {
  return (
    <Suspense fallback={<SkeletonAdminLayout />}>
      <ArticlePage />
    </Suspense>
  );
}
