import { Suspense } from "react";
import ArticlePage from "@/components/dashboard/pages/ArticlePage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading articles...</div>}>
      <ArticlePage />
    </Suspense>
  );
}
