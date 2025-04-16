"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smile, Laugh, Meh, Frown, Angry } from "lucide-react";

import { Toast } from "@/components/dashboard/ui/Toast/Toast";

type FeedbackValue = 1 | 2 | 3 | 4 | 5;

interface FeedbackFormProps {
  therapistId: string;
}

interface TherapistData {
  name: string;
  image: string;
}

export default function FeedbackForm({ therapistId }: FeedbackFormProps) {
  const [therapistData, setTherapistData] = useState<TherapistData | null>(
    null
  );

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const res = await fetch(`/api/therapist/${therapistId}`);
        const data = await res.json();
        setTherapistData({ name: data.name, image: data.imageUrl });
      } catch (error) {
        console.error("Gagal mengambil data terapis", error);
      }
    };

    fetchTherapist();
  }, [therapistId]);

  const [step, setStep] = useState(1);

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [feedback, setFeedback] = useState({
    cleanliness: 0 as FeedbackValue,
    politeness: 0 as FeedbackValue,
    pressure: 0 as FeedbackValue,
    punctuality: 0 as FeedbackValue,
  });

  const router = useRouter();

  const handleFeedbackChange = (
    key: keyof typeof feedback,
    value: FeedbackValue
  ) => {
    setFeedback((prev) => ({ ...prev, [key]: value }));
    // Auto next step setelah pilih feedback
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 200); // beri delay kecil agar animasi klik terasa
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const totalScore = Object.values(feedback).reduce((acc, val) => acc + val, 0);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          therapistId,
          name: customerName,
          contact: customerContact,
          cleanliness: feedback.cleanliness,
          politeness: feedback.politeness,
          pressure: feedback.pressure,
          punctuality: feedback.punctuality,
          totalScore,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setToast({
          message: "Terima kasih atas feedback Anda!",
          type: "success",
        });

        setTimeout(() => {
          router.push("/feedback/thanks");
        }, 2000);
      } else {
        const data = await res.json().catch(() => null);
        console.error("Error:", data || "Unknown error");
        setToast({ message: "Gagal mengirim feedback.", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setToast({ message: "Terjadi kesalahan saat mengirim.", type: "error" });
    }
  };

  const labels = [
    { icon: <Laugh className="w-5 h-5" />, text: "Sangat Memuaskan" },
    { icon: <Smile className="w-5 h-5" />, text: "Memuaskan" },
    { icon: <Meh className="w-5 h-5" />, text: "Cukup" },
    { icon: <Frown className="w-5 h-5" />, text: "Tidak Memuaskan" },
    { icon: <Angry className="w-5 h-5" />, text: "Sangat Tidak Memuaskan" },
  ];

  const feedbackKeys = [
    "cleanliness",
    "politeness",
    "pressure",
    "punctuality",
  ] as const;
  const currentKey = feedbackKeys[step - 2];

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        Silahkan isi data dibawah ini untuk masukan (feedback) pada terapis kami
      </div>
      <hr className="mb-3" />

      {/* Step 1 - Customer Info */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Isi Data Anda</h2>
          <input
            placeholder="Nama"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full mb-2 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="No. Kontak (contoh: 0895xxxxxxxx)"
            value={customerContact}
            onChange={(e) => setCustomerContact(e.target.value)}
            className="w-full mb-4 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full text-sm hover:bg-blue-700"
          >
            Next
          </button>
        </>
      )}

      {/* Step 2-5 - Feedback Steps */}
      {step >= 2 && step <= 5 && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {
              [
                "Cleanliness | Kebersihan Ruangan",
                "Politeness | Sopan Santun",
                "Pressure | Tekanan Pijat",
                "Punctuality | Ketepatan Waktu",
              ][step - 2]
            }
          </h2>
          <div className="flex flex-col gap-3 mb-4">
            {[5, 4, 3, 2, 1].map((value) => (
              <button
                key={value}
                onClick={() =>
                  handleFeedbackChange(currentKey, value as FeedbackValue)
                }
                className={`flex items-center gap-2 justify-start w-full px-4 py-2 border rounded-lg transition transform active:scale-95
                  ${
                    feedback[currentKey] === value
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-100"
                  }`}
              >
                {labels[5 - value].icon}
                <span>{labels[5 - value].text}</span>
              </button>
            ))}
          </div>
          <hr className="mb-4" />
          <div className="flex justify-start">
            <button
              onClick={prevStep}
              className="text-sm underline text-gray-600"
            >
              Back
            </button>
          </div>
        </>
      )}

      {/* Step 6 - Summary */}
      {step === 6 && (
        <>
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold mb-2">Ringkasan Feedback</h2>

            {therapistData && (
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={therapistData.image || "/default-avatar.png"} // default image jika tidak ada
                  alt={therapistData.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {/* Nama dan ID tetap di kiri */}
                <div className="text-left">
                  <p className="font-semibold text-lg">{therapistData.name}</p>
                  <p className="text-sm text-gray-500">ID: {therapistId}</p>
                </div>
              </div>
            )}

            <p>
              <strong>Total Summary:</strong> {totalScore}
            </p>
          </div>

          <hr className="mt-4" />
          <div className="flex justify-between mt-4">
            <button
              onClick={prevStep}
              className="text-sm underline text-gray-600"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
