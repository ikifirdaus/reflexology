"use client";

import FeedbackLayout from "@/components/frontend/layouts/FeedbackLayout";
import { CheckCircle } from "lucide-react";
// import Link from "next/link";

export default function ThankYouPage() {
  return (
    <FeedbackLayout>
      <div className=" flex flex-col items-center justify-center text-center px-4">
        <CheckCircle className="w-20 h-20 text-[#442D18] mb-4" />
        <h1 className="text-2xl font-title text-[#442D18] mb-2">
          Thank you for your feedback.
        </h1>
        <p className="font-body text-[#442D18] text-[14px] mb-6">
          Feedback Anda telah berhasil dikirim. Masukan Anda sangat berarti bagi
          kami.
        </p>
        {/* <Link
          href="/"
          className="text-blue-600 underline hover:text-blue-800 text-sm"
        >
          Kembali ke Beranda
        </Link> */}
      </div>
    </FeedbackLayout>
  );
}
