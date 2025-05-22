"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

  const [isLoadingTherapist, setIsLoadingTherapist] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (step === 6) {
      const fetchTherapist = async () => {
        try {
          setIsLoadingTherapist(true);
          const res = await fetch(`/api/therapist/${therapistId}`);
          const data = await res.json();
          setTherapistData({ name: data.name, image: data.imageUrl });
        } catch (error) {
          console.error("Gagal mengambil data terapis", error);
        } finally {
          setIsLoadingTherapist(false);
        }
      };
      fetchTherapist();
    }
  }, [step, therapistId]);

  const handleFeedbackChange = (
    key: keyof typeof feedback,
    value: FeedbackValue
  ) => {
    setFeedback((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => setStep((prev) => prev + 1), 200);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const totalScore =
    feedback.politeness + feedback.pressure + feedback.punctuality;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          therapistId,
          name: customerName,
          contact: customerContact,
          ...feedback,
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
        setTimeout(() => router.push("/feedback/thanks"), 2000);
      } else {
        const data = await res.json().catch(() => null);
        console.error("Error:", data || "Unknown error");
        setToast({ message: "Gagal mengirim feedback.", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setToast({ message: "Terjadi kesalahan saat mengirim.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const labels = [
    {
      icon: (
        <div className="relative w-5 h-5 sm:w-7 sm:h-7">
          <Image
            src="/emoji/5.png"
            alt="Amazing"
            fill
            className="object-contain"
          />
        </div>
      ),
      text: "Amazing",
    },
    {
      icon: (
        <div className="relative w-5 h-5 sm:w-7 sm:h-7">
          <Image
            src="/emoji/4.png"
            alt="Good"
            fill
            className="object-contain"
          />
        </div>
      ),
      text: "Good",
    },
    {
      icon: (
        <div className="relative w-5 h-5 sm:w-7 sm:h-7">
          <Image
            src="/emoji/3.png"
            alt="Okay"
            fill
            className="object-contain"
          />
        </div>
      ),
      text: "Okay",
    },
    {
      icon: (
        <div className="relative w-5 h-5 sm:w-7 sm:h-7">
          <Image src="/emoji/2.png" alt="Bad" fill className="object-contain" />
        </div>
      ),
      text: "Bad",
    },
    {
      icon: (
        <div className="relative w-5 h-5 sm:w-7 sm:h-7">
          <Image
            src="/emoji/1.png"
            alt="Terrible"
            fill
            className="object-contain"
          />
        </div>
      ),
      text: "Terrible",
    },
  ];

  const feedbackKeys = [
    "cleanliness",
    "politeness",
    "pressure",
    "punctuality",
  ] as const;
  const currentKey = feedbackKeys[step - 2];

  return (
    <div className="max-w-md mx-auto text-[#442D18]">
      <div className="text-center mb-1">
        {step === 1 && (
          <>
            <h1 className="font-title text-2xl uppercase mb-1">
              THERAPIST FEEDBACK FORM
            </h1>
            <p className="font-body text-base text-[14px] mb-1">
              Pendapatmu sangat berarti, bantu Sendja jadi lebih baik dengan
              memberikan feedback pada terapis kami.
            </p>
            <p className="font-body text-[12px] italic text-[#A2968C]/80">
              Please help Sendja improve by giving feedback to our therapists.
            </p>
          </>
        )}
      </div>

      {step === 1 && (
        <>
          <hr className="mb-4 mt-4 rounded-sm border-[#A2968C]" />
          <input
            placeholder="Nama"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="font-body w-full mb-3 border border-[#A2968C] p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C26728] text-sm"
          />
          <input
            type="number"
            placeholder="No. Kontak (contoh: 0895xxxxxxxx)"
            value={customerContact}
            onChange={(e) => setCustomerContact(e.target.value)}
            className="font-body w-full mb-4 border border-[#A2968C] p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C26728] text-sm"
          />
          <button
            onClick={nextStep}
            className="font-body bg-[#C26728] text-white px-4 py-3 rounded-lg w-full text-sm hover:bg-[#C26728]/80"
          >
            Next
          </button>
        </>
      )}

      {step >= 2 && step <= 5 && (
        <>
          <h2 className="font-title text-2xl uppercase">
            {
              [
                "TREATMENT ROOM",
                "POLITENESS",
                "MASSAGE PRESSURE",
                "MASSAGE TIMING",
              ][step - 2]
            }
          </h2>
          <p className="font-body text-[14px] text-base">
            {
              [
                "Cleanliness, Readiness, Ambiance",
                "Greeting. Friendliness communication. Service.",
                "Kenyamanan dalam tekanan pijat selama treatment.",
                "Informasi mengenai waktu dimulai dan berakhir sesi pijat.",
              ][step - 2]
            }
          </p>
          <p className="font-body text-[12px] italic text-[#A2968C]/80 mb-4">
            {
              [
                "Room cleanliness and therapist appearance.",
                "Greeting and service attitude.",
                "Massage pressure comfort.",
                "Information about session start and end times.",
              ][step - 2]
            }
          </p>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {[5, 4, 3, 2, 1].map((value) => {
              const isSelected = feedback[currentKey] === value;
              return (
                <button
                  key={value}
                  onClick={() =>
                    handleFeedbackChange(currentKey, value as FeedbackValue)
                  }
                  className={`text-body flex flex-col items-center justify-center p-2 rounded-xl border-2 text-sm transition-all active:scale-95
                  ${
                    isSelected
                      ? "bg-[#F5E6DB] border-[#442D18]"
                      : "border-[#A2968C] hover:bg-[#F5E6DB]"
                  }`}
                >
                  <div>{labels[5 - value].icon}</div>
                  <span className="text-[9px] sm:text-md md:text-sm">
                    {labels[5 - value].text}
                  </span>
                </button>
              );
            })}
          </div>

          <hr className="mb-4 rounded-sm border-[#A2968C]" />
          <div className="flex justify-start">
            <button
              onClick={prevStep}
              className="text-body text-sm underline text-[#A2968C]"
            >
              Back
            </button>
          </div>
        </>
      )}

      {step === 6 && (
        <>
          {isLoadingTherapist ? (
            <div className="flex justify-center mb-4">
              <div className="w-[200px] aspect-[3/4] bg-[#F5E6DB] animate-pulse rounded-lg shadow-md flex justify-center items-center">
                {" "}
                Loading Image...{" "}
              </div>
            </div>
          ) : (
            therapistData && (
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="w-full flex justify-center mb-4">
                  <div className="w-[200px] aspect-[3/4] overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={
                        therapistData.image?.startsWith("http") ||
                        therapistData.image.startsWith("/")
                          ? therapistData.image
                          : `/therapist/${
                              therapistData.image || "default-avatar.png"
                            }`
                      }
                      alt={therapistData.name}
                      width={300}
                      height={366}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <div className="text-center text-2xl">
                  <p className="font-title text-[#A2968C]">
                    Therapist No: {therapistId}
                  </p>
                  <p className="font-title uppercase">{therapistData.name}</p>
                </div>
              </div>
            )
          )}

          <hr className="mb-4 rounded-sm border-[#A2968C]" />

          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-body">
              Kami menghargai waktu Anda. Silakan kirim feedback dengan menekan
              tombol Submit di bawah.
            </p>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={prevStep}
              className="text-body text-sm underline text-[#A2968C]"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="text-body bg-[#C26728] text-white px-4 py-2 rounded-lg hover:bg-[#C26728]/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Mengirim...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </>
      )}

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
