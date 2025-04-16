import { Suspense } from "react";
import TherapistPage from "@/components/dashboard/pages/TherapistPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading therapist...</div>}>
      <TherapistPage />
    </Suspense>
  );
}
