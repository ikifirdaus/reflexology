import { Suspense } from "react";
import UserPage from "@/components/dashboard/pages/UserPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserPage />
    </Suspense>
  );
}
