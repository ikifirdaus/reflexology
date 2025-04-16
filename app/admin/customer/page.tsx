import { Suspense } from "react";
import CustomerPage from "@/components/dashboard/pages/CustomerPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading customer...</div>}>
      <CustomerPage />
    </Suspense>
  );
}
