import { Suspense } from "react";
import FeedbackPage from "@/components/dashboard/pages/FeedbackPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading feedback...</div>}>
      <FeedbackPage />
    </Suspense>
  );
}
