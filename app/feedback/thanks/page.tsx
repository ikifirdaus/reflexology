"use client";

import FeedbackLayout from "@/components/frontend/layouts/FeedbackLayout";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <FeedbackLayout>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <CheckCircle className="w-20 h-20 text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Terima Kasih atas Partisipasi Anda!
        </h1>
        <p className="text-gray-600 mb-6">
          Feedback Anda telah berhasil dikirim. Masukan Anda sangat berarti bagi
          kami.
        </p>
        <Link
          href="/"
          className="text-blue-600 underline hover:text-blue-800 text-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </FeedbackLayout>
  );
}
