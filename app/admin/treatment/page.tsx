import { Suspense } from "react";
import TreatmentPage from "@/components/dashboard/pages/TreatmentPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading treatment...</div>}>
      <TreatmentPage />
    </Suspense>
  );
}
